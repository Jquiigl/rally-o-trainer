# Rally O Trainer

PWA local-first para planificar y registrar entrenamientos de Rally Obedience con prioridad RSCE y referencia FCI.

Aplicación publicada: [https://jquiigl.github.io/rally-o-trainer/](https://jquiigl.github.io/rally-o-trainer/)

## Estado actual

El incremento funcional P1 incluye:

- instalación como PWA y funcionamiento sin conexión tras la primera carga;
- perfiles locales de varios perros con nombre y raza;
- biblioteca completa de Debutante: 22 señales FCI de Grupo 1 y 11 señales nacionales RSCE;
- ficha con descripción reglamentaria de redacción propia, explicación sencilla y consejo positivo;
- recomendación determinista y elección manual de cualquier señal;
- preparación de sesiones individuales de hasta 15 minutos;
- registro a un toque: incorrecta, con ayuda o autónoma;
- progreso independiente por perro y lado;
- aprendizaje con 7 ejecuciones autónomas de 10 en al menos dos días;
- detección de regresión y repaso tras 30 días;
- exportación y restauración de una copia local completa;
- temas claro, oscuro y según dispositivo.
- constructor local de pistas Debutante de hasta diez señales;
- modo examen offline de reconocimiento de señales;
- navegación separada RSCE/FCI y por grado, mostrando únicamente fichas revisadas.

No incluye todavía ejecución guiada de pistas, vídeos, comparación, compartir, colaboración ni sincronización. Esas funciones están especificadas en el roadmap, pero no se simulan en la interfaz antes de ser funcionales.

## Ejecutar

Requisitos: Node.js 22 o superior y pnpm 11.

```bash
pnpm install
pnpm dev
```

Comprobación integral:

```bash
pnpm check
```

## Publicar en GitHub Pages

El alojamiento elegido es GitHub Pages, con repositorio público y despliegue automático desde la rama `main`. El nombre recomendado para el repositorio es `rally-o-trainer`.

1. Crea una cuenta gratuita en GitHub, si todavía no la tienes.
2. Crea un repositorio público vacío llamado `rally-o-trainer`.
3. Vincula este proyecto y envía la rama principal:

```bash
git remote add origin https://github.com/Jquiigl/rally-o-trainer.git
git push -u origin main
```

4. En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente.
5. Comprueba la ejecución **Deploy GitHub Pages** en la pestaña **Actions**.

La dirección resultante será `https://jquiigl.github.io/rally-o-trainer/`. Cada envío posterior a `main` ejecutará todas las comprobaciones y solo publicará si terminan correctamente.

La publicación distribuye únicamente los archivos de la aplicación. Los perros, entrenamientos y copias permanecen en el navegador de cada dispositivo y no se suben al repositorio ni a GitHub Pages.

## Documentación

- `PRD/`: capítulos 01–19 del PRD, incluido el registro consolidado de decisiones.
- `Contenido/`: contenido editorial, fuentes extraídas y base de conocimiento.
- `Reglamento/`: progresión estructurada y trazabilidad reglamentaria.
- `Fuentes oficiales/`: copias locales de los PDF consultados.
- `Manuales/`: guía de uso y guía de desarrollo.

## Aviso

Rally O Trainer es una herramienta independiente basada en fuentes oficiales RSCE/FCI. No está afiliada a dichas entidades y no sustituye sus reglamentos vigentes ni el criterio de un juez.
