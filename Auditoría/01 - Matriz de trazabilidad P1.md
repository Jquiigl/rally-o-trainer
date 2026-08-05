# Matriz de trazabilidad del incremento P1

## Alcance auditado

La auditoría cubre el primer incremento ejecutable: flujo vertical completo para Debutante, arquitectura preparada para ampliación y documentación de producto completa. Las funciones de roadmap posteriores no se presentan como terminadas.

| Requisito | Evidencia de diseño | Evidencia ejecutable | Verificación |
|---|---|---|---|
| Mobile first y una mano | PRD 05, 15 y 16 | navegación inferior, controles de 44–52 px y tres botones grandes | revisión estática; prueba física pendiente |
| Menos de tres pulsaciones | PRD 05 | Inicio → Preparar → Empezar | recorrido implementado |
| Sesión de 15 minutos | PRD 10 | temporizador y fases 2/10–11/2–3 | compilado |
| Cierre anticipado | PRD 10 | Finalizar registra `ended-early` si queda tiempo | compilado |
| Tres resultados rápidos | PRD 10 | Incorrecta, Con ayuda, Autónoma | compilado |
| 7 de 10 en dos días | PRD 11 | `calculateProgress` | prueba automática |
| Progreso por lado y perro | PRD 07, 11 y 12 | evidencia filtrada por perro y lado | prueba del dominio y revisión de consultas |
| Repaso a 30 días | PRD 11 | razón `overdue-30d` | prueba automática |
| Regresión tras aprender | PRD 11 | ventana histórica y `below-window` | prueba automática |
| Elección manual | PRD 11 | listado completo además de recomendación | prueba del planificador |
| Prioridad RSCE | PRD 08 y 09 | nacionales y asignaciones RSCE en Debutante | validador de contenido |
| Contenido Debutante | PRD 08 y 09 | 22 FCI Grupo 1 + 11 nacionales | validador: 33 señales |
| Consulta en lenguaje sencillo | PRD 09 | tres capas editoriales en cada ficha | validador de longitud y estado |
| Offline e instalable | PRD 17 | manifiesto, iconos, service worker y precaché | build PWA |
| Sin registro ni backend | PRD 06 y 17 | no existen endpoints ni autenticación | inspección de dependencias |
| Datos bajo control | PRD 14 | exportación, restauración y borrado doble | compilado; prueba física pendiente |
| iOS, Android y escritorio | PRD 17 | web responsive, safe areas, icono Apple | iPhone y Android físicos pendientes |
| Temas claro y oscuro | PRD 16 | tokens CSS y selector persistido | compilado |
| Base fuente completa FCI | PRD 08 | 91 entradas, 89 ejercicios | validador de contenido |

## Resultado automático

La entrega debe considerarse técnicamente válida solo si `pnpm check` finaliza correctamente. La salida esperada incluye:

- 91 entradas fuente FCI;
- 33 señales Debutante revisadas;
- compilación TypeScript sin errores;
- once o más pruebas unitarias superadas;
- generación de `manifest.webmanifest`, `sw.js` y recursos de precaché.

## Controles manuales antes del piloto

- [ ] Recorrido completo en iPhone 16 Pro.
- [ ] Cierre y reapertura en modo avión.
- [ ] Instalación y recorrido completo en Android físico.
- [ ] Exportar, eliminar datos de prueba y restaurar copia.
- [ ] Probar modo oscuro y tamaño de texto aumentado.
- [ ] Revisión final del propietario de las 33 fichas Debutante.
- [ ] Confirmar que una actualización no interrumpe una sesión activa.

## Riesgos

- No hubo un navegador conectado durante esta ejecución, por lo que la revisión visual automatizada no pudo realizarse.
- IndexedDB y el ciclo de instalación presentan diferencias reales entre Safari y Chrome.
- El lote Debutante es publicable tras aprobación del propietario; los grupos FCI 2–4 permanecen como inventario fuente.

## Mejoras posibles

- Automatizar los recorridos críticos con Playwright cuando el entorno disponga de navegador.
- Añadir una prueba de restauración sobre IndexedDB.
- Generar un informe de Lighthouse tras la primera publicación en GitHub Pages.

## Decisiones pendientes

- Resultado de las pruebas físicas en iPhone 16 Pro y Android.
- Aprobación editorial final del lote Debutante.
- Prueba física de la publicación de GitHub Pages.
