#!/usr/bin/env python3
"""Extract the official sign artwork supplied by the project owner.

FCI signs are rendered from their individual PDF pages. RSCE national signs
are copied from the embedded images in pages 8 and 9 of the 2026 regulation.
The script is deterministic so the assets can be regenerated and audited.
"""

from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
FCI_PDF = ROOT / "Fuentes oficiales" / "RSCE-Senales-FCI-Espanol.pdf"
RSCE_PDF = ROOT / "Fuentes oficiales" / "RSCE-Reglamento-Rally-Obedience-2026.pdf"
OUTPUT = ROOT / "public" / "signals"

RSCE_IMAGES = {
    "13": (8, "R98.jpg"),
    "14": (8, "R97.jpg"),
    "15": (8, "R102.jpg"),
    "16": (8, "R103.jpg"),
    "25": (8, "R99.jpg"),
    "26": (8, "R100.jpg"),
    "28": (8, "R101.jpg"),
    "33": (9, "R109.jpg"),
    "34": (9, "R110.jpg"),
    "35": (9, "R112.jpg"),
    "36": (9, "R111.jpg"),
}


def require(path: Path) -> None:
    if not path.is_file():
        raise SystemExit(f"Missing source PDF: {path}")


def save_webp(image: Image.Image, target: Path, *, lossless: bool = False) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(target, "WEBP", quality=92, method=6, lossless=lossless)


FCI_PAGE_RANGES = (
    (range(101, 123), 5, 26),
    (range(201, 223), 28, 49),
    (range(301, 324), 51, 73),
    (range(401, 423), 75, 96),
)


def extract_fci() -> None:
    pdftoppm = shutil.which("pdftoppm")
    if not pdftoppm:
        raise SystemExit("pdftoppm is required to render the official FCI PDF")

    with tempfile.TemporaryDirectory(prefix="rally-signs-") as temporary:
        temporary_path = Path(temporary)
        total = 0
        for codes, first_page, last_page in FCI_PAGE_RANGES:
            prefix = temporary_path / f"fci-{first_page}"
            subprocess.run(
                [
                    pdftoppm,
                    "-f", str(first_page), "-l", str(last_page), "-r", "140", "-png",
                    str(FCI_PDF), str(prefix),
                ],
                check=True,
            )
            rendered = sorted(temporary_path.glob(f"{prefix.name}-*.png"))
            expected = len(codes)
            if len(rendered) != expected:
                raise SystemExit(f"Expected {expected} FCI signs on pages {first_page}-{last_page}, found {len(rendered)}")

            for code, source in zip(codes, rendered, strict=True):
                with Image.open(source) as page:
                    # Preserve the complete official page. Some advanced signs use
                    # nearly the full page height, so a generic crop can remove
                    # essential text, arrows or pause markers.
                    save_webp(page, OUTPUT / "fci" / f"{code}.webp")
                total += 1
        if total != 89:
            raise SystemExit(f"Expected 89 FCI signs, extracted {total}")


def extract_rsce() -> None:
    reader = PdfReader(str(RSCE_PDF))
    for code, (page_number, image_name) in RSCE_IMAGES.items():
        images = {image.name: image.image for image in reader.pages[page_number - 1].images}
        if image_name not in images:
            raise SystemExit(f"Missing embedded image {image_name} on RSCE page {page_number}")
        save_webp(images[image_name], OUTPUT / "rsce" / f"{code}.webp", lossless=True)


def main() -> None:
    require(FCI_PDF)
    require(RSCE_PDF)
    extract_fci()
    extract_rsce()
    print("Extracted 89 FCI and 11 RSCE official signs")


if __name__ == "__main__":
    main()
