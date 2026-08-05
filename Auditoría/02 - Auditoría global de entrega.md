# Auditoría global de entrega

## 1. Regla de lectura

Esta auditoría distingue entrega construida de validación externa. Un `check` automático verde demuestra integridad de fuentes, contenido, tipos, pruebas y build; no demuestra ergonomía en pista, persistencia real de Safari ni calidad editorial aprobada por el propietario.

## 2. Artefactos solicitados

| Artefacto | Evidencia | Estado |
|---|---|---|
| Arquitectura técnica | PRD 06 y código modular | Completo |
| Modelo de datos | PRD 07, tipos y Dexie v2 | Completo para incrementos actuales |
| Wireframes de todas las pantallas | PRD 15, 27 vistas descritas | Completo documental |
| Sistema de diseño | PRD 16, tokens CSS e iconos | Completo v1 |
| Guía de estilo | PRD 16 | Completo v1 |
| Especificación PWA | PRD 17, manifest y service worker | Completo; prueba física pendiente |
| Base de todas las señales | 91 entradas fuente FCI, 89 ejercicios y 11 nacionales | Completo como base |
| Reglamento RSCE estructurado | `Reglamento/progression.json` y fuentes | Completo para progresión y pistas actuales |
| Base de entrenamiento | `Contenido/training-knowledge.es.md` y consejos por señal | Completo v1 |
| Planificación inteligente | PRD 11 y planificador determinista | Completo básico |
| Repasos espaciados | ventanas, fechas, estados y próxima revisión | Completo v1 |
| Constructor de pistas | secuencia local Debutante y persistencia | Completo como incremento inicial; no geométrico |
| Importación/exportación | copia total JSON validada y restauración transaccional | Completo v1 |
| Plan de pruebas | PRD 18 y matriz de trazabilidad | Completo |
| Manual de usuario | `Manuales/01 - Manual de usuario.md` | Completo para estado actual |
| Manual del desarrollador | `Manuales/02 - Manual del desarrollador.md` | Completo para estado actual |

## 3. Requisitos de producto

| Requisito | Evidencia directa | Dictamen |
|---|---|---|
| Una mano y rapidez | controles grandes, navegación inferior, registro a un toque | Implementado; falta pista real |
| Menos de tres pulsaciones | Inicio → Preparar → Empezar | Demostrado por estructura; falta usabilidad física |
| Offline | `generateSW`, 9 recursos únicos precargados | Build demostrado; modo avión físico pendiente |
| Instalable | manifest, iconos, Apple metadata | Build demostrado; instalación física pendiente |
| Sin cuenta/publicidad | no hay autenticación, endpoints, SDK o anuncios | Demostrado por código y dependencias |
| Datos locales | Dexie/IndexedDB | Demostrado por arquitectura; persistencia física pendiente |
| Exportación y restauración | esquema Zod, referencias y transacción | Implementado; recorrido físico pendiente |
| Perros independientes | `dogId`, selector y bloqueo durante sesión | Implementado |
| 15 minutos | temporizador, fases y cierre anticipado | Implementado |
| Resultado rápido | tres botones, deshacer, ayuda opcional | Implementado |
| Aprendizaje 7/10 y dos días | función pura y pruebas | Demostrado |
| Ambos lados | evidencia y estados por lado | Demostrado |
| Repaso a 30 días | cálculo y prueba | Demostrado |
| Prioridad RSCE | pestaña inicial, nacionales y progresión | Implementado |
| FCI separado | pestaña independiente | Implementado |
| Consulta abierta | grados visibles; selección manual no filtrada por planificador | Implementado para fichas revisadas |
| Bienestar y positivo | base de conocimiento, consejos y cierre | Implementado como contenido; depende del uso |

## 4. Contenido

| Control | Resultado |
|---|---|
| PDF FCI | checksum correcto |
| PDF reglamento RSCE | checksum correcto |
| PDF señales españolas | checksum correcto |
| Inventario FCI | 22 + 22 + 23 + 22 = 89 ejercicios; START/FINISH separados |
| Nacionales RSCE | 11 señales |
| Debutante | 33 fichas revisadas y visibles |
| Grupos 2–4 | 67 fichas españolas completas, estado `draft`, fuente inglesa conservada |
| Prerrequisitos avanzados | relaciones explícitas y validadas |
| Control de publicación | la app no importa paquetes `draft` |

## 5. Verificación automática final esperada

`pnpm check` debe demostrar conjuntamente:

1. tres PDF y checksums válidos;
2. regeneración reproducible de los paquetes;
3. 91 entradas fuente, 33 fichas revisadas y 67 borradores avanzados;
4. TypeScript sin errores;
5. pruebas unitarias y de interfaz sin fallos;
6. build PWA con manifiesto y service worker;
7. `git diff --check` sin errores de espacios.

## 6. No conformidades y límites conscientes

| Elemento | Motivo | Acción |
|---|---|---|
| Revisión visual automatizada | No había navegador conectado en el entorno | Ejecutar cuando exista navegador o durante prueba física |
| iPhone 16 Pro | Requiere el dispositivo del propietario | Checklist manual |
| Android | Modelo aún no elegido | Elegir uno antes del piloto |
| Grupos 2–4 visibles | Falta aprobación editorial del propietario | Completar checklist y publicar nueva versión |
| Alojamiento HTTPS | Publicado y comprobado en navegador de escritorio | Ejecutar el protocolo físico sobre la URL publicada |
| Ejecución guiada de pistas | No pertenece al primer constructor secuencial | Valorar después del piloto |
| Sincronización y colaboración | Aumentan coste y contradicen objetivo inmediato | Mantener en roadmap |

## 7. Conclusión

La documentación profesional, la base completa de contenido y dos incrementos funcionales existen y pasan controles automáticos. El software está listo para revisión editorial avanzada y pruebas físicas, pero todavía no debe describirse como piloto validado ni como contenido avanzado publicado.

## Riesgos

- Publicar sin completar los controles físicos puede ocultar fallos específicos de iOS o Android.
- Aprobar borradores por lote sin compararlos señal a señal reduce trazabilidad.
- Ampliar funciones antes del piloto puede deteriorar la simplicidad conseguida.

## Mejoras posibles

- Pruebas de IndexedDB con un entorno controlado.
- Automatización end-to-end cuando haya navegador disponible.
- Informe Lighthouse desde GitHub Pages después de la primera publicación.
- Validación de contraste y texto ampliado en dispositivos físicos.

## Decisiones pendientes

- Aprobación editorial avanzada.
- Resultado de controles iPhone/Android.
- Resultado de las pruebas físicas sobre GitHub Pages.
- Prioridad del tercer incremento tras uso real.
