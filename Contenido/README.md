# Contenido de Rally O Trainer

Esta carpeta separa material fuente, contenido editorial y datos publicables.

## Capas

| Archivo o carpeta | Función | ¿Publicable? |
|---|---|:---:|
| `../Fuentes oficiales/` | PDFs originales descargados para revisión | No se incluye en la PWA |
| `fci-signals.source.json` | Extracción mecánica de la sección 5 FCI | No |
| `p1-signals.es.json` | Primer lote editorial en español | Sí, tras validación |
| `debutante-signals.es.json` | Paquete revisado de las 22 señales FCI de Grupo 1 y las 11 nacionales RSCE | Sí, tras validación |
| `fci-groups-2-4.draft.es.json` | Fuente editorial generada de los Grupos 2–4; el nombre histórico se conserva, pero sus 67 registros están revisados | Sí, únicamente mediante la selección publicada |
| `advanced-review.json` | Lista explícita de códigos avanzados aprobados por el propietario | No |
| `published-signals.es.json` | Selección generada que la PWA puede mostrar y recomendar | Sí |
| `rsce-national-signals.source.md` | Inventario y localización de señales nacionales | No |
| `training-knowledge.es.md` | Principios y patrones pedagógicos | Sí, por fragmentos revisados |

## Estados editoriales

- `source-extracted`: obtenido mecánicamente; necesita revisión visual.
- `draft`: redacción propia incompleta o pendiente de segunda lectura.
- `reviewed`: comprobado contra fuente y guía editorial.
- `published`: aprobado para el paquete activo.
- `superseded`: conservado para historial.

## Regla de publicación

Nada con estado `source-extracted` o `draft` se muestra en el uso normal. La extracción nunca sustituye la revisión visual del PDF.

## Verificación

El script `scripts/extract-fci-signals.mjs` debe producir exactamente:

- 22 señales de Grupo 1;
- 22 señales de Grupo 2;
- 23 señales de Grupo 3;
- 22 señales de Grupo 4;
- `START` y `FINISH`.

Total: 91 entradas, 89 de ellas ejercicios.

Para regenerar todos los paquetes y comprobarlos: `pnpm content:build`, `pnpm content:build:advanced`, `pnpm content:build:published` y `pnpm content:validate`.

Los 67 códigos avanzados están aprobados en `advanced-review.json` desde el 6 de agosto de 2026. Sus prerrequisitos determinan por perro si el planificador puede recomendarlos, mientras la biblioteca completa continúa siendo consultable.
