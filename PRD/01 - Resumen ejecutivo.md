# PRD — Capítulo 01: Resumen ejecutivo

| Campo | Valor |
|---|---|
| Producto | Rally O Trainer |
| Tipo | Progressive Web App local-first |
| Estado del capítulo | Cerrado y coherente con los capítulos 02–18 |
| Fecha | 5 de agosto de 2026 |
| Alcance | Dirección de producto, propuesta de valor y restricciones globales |
| Próximo capítulo | Visión |

> Este capítulo fija el marco de decisión del producto. No sustituye los capítulos posteriores de requisitos, arquitectura, datos, experiencia de usuario o pruebas.

---

## Análisis previo

### 1. Hipótesis revisadas

Antes de redactar este resumen se han tratado las decisiones iniciales como hipótesis, no como requisitos irrevocables.

| Hipótesis inicial | Evaluación crítica | Decisión propuesta |
|---|---|---|
| La aplicación puede empezar como biblioteca y registro; la inteligencia puede esperar a la versión 2. | Contradice la propuesta de valor. Una primera versión sin recomendación sería principalmente un catálogo con diario. | Incluir en el MVP un planificador básico basado en reglas, explicable y sin aprendizaje automático. Evolucionar después su sofisticación. |
| “Inicio, Entrenamiento, Señales, Perros, Registro, Estadísticas y Configuración” constituye la arquitectura. | Es una lista de posibles destinos, no una arquitectura funcional. Siete destinos principales son excesivos para navegación móvil de una mano. | Mantenerla como inventario provisional. Definir la navegación después de priorizar tareas y probarla con usuarios. |
| Varios perros puede esperar hasta la versión 4. | Posponer la entidad múltiple obliga a migrar datos y supuestos de interfaz más adelante. Además, un guía puede entrenar más de un perro desde el primer día. | Diseñar el modelo para múltiples perros desde el inicio. Validar si el MVP expone uno o varios perfiles, pero nunca asociar los datos a un único perro implícito. |
| “Funciona completamente offline” basta como requisito. | No define primera instalación, actualización del reglamento, vídeos, copias de seguridad ni riesgo de expulsión del almacenamiento por el sistema. | Definir un núcleo funcional offline verificable. La primera descarga y las actualizaciones requieren conexión; ninguna función principal de pista debe depender de ella. |
| Instalarse como una aplicación equivale a ser una aplicación nativa. | Una PWA instalada conserva límites distintos en iOS, Android y escritorio. Prometer equivalencia total generaría requisitos imposibles. | Hablar de experiencia instalable. Documentar y probar las diferencias por plataforma. |
| El reglamento RSCE/FCI es contenido fijo. | La normativa cambia y los ámbitos nacional e internacional no son intercambiables. | Tratar cada reglamento como un conjunto de contenido versionado, con jurisdicción, vigencia, fuente y trazabilidad. |
| “Menos de tres pulsaciones” debe cumplirse en toda función. | Como regla absoluta perjudicaría tareas infrecuentes o peligrosas, como borrar datos. | Aplicarla a tareas principales de entrenamiento; permitir más pasos cuando eviten errores o aclaren una decisión irreversible. |
| Almacenamiento local implica automáticamente control del usuario. | El usuario puede perder datos al borrar el sitio, cambiar de dispositivo o sufrir una expulsión del almacenamiento. | Añadir exportación y copia de seguridad guiada desde el MVP; la sincronización seguirá siendo opcional y posterior. |

### 2. Puntos débiles detectados

1. **La promesa “mejor aplicación” no es medible.** Debe traducirse en resultados observables: rapidez para empezar, utilidad de las recomendaciones, constancia y evolución del binomio.
2. **El roadmap actual prioriza módulos y no resultados.** No explica qué problema resuelve cada versión ni qué evidencia habilita la siguiente.
3. **No existe todavía una definición de progreso.** Acumular sesiones no equivale a mejorar; será necesario registrar dominio, calidad, contexto, ayudas y consistencia.
4. **No se ha definido la autoridad del contenido.** Las instrucciones de señales, grados y penalizaciones deben vincularse a una edición reglamentaria concreta.
5. **Falta una política de bienestar canino.** Un planificador deportivo no debe recomendar repetición mecánica, sobreentrenamiento o pautas incompatibles con la salud y el estado emocional del perro.
6. **La promesa offline tiene riesgos de pérdida de datos.** La persistencia del navegador no sustituye una copia de seguridad.
7. **No hay estrategia explícita de validación.** Las decisiones de una mano, navegación y registro rápido deben probarse en pista, no solo en escritorio.

### 3. Mejoras propuestas y justificación

#### 3.1 Producto local-first, no solo offline-compatible

Los datos y la lógica principal residirán en el dispositivo. La red será una mejora progresiva para actualizaciones, restauración y futura sincronización, nunca una dependencia para entrenar. Esto simplifica el inicio, evita el registro obligatorio y protege la continuidad en pistas con mala cobertura.

#### 3.2 Inteligencia gradual y explicable

El MVP no necesita inteligencia artificial ni un modelo predictivo. Un motor de reglas puede recomendar qué entrenar usando señales vencidas, grado objetivo, historial reciente, nivel de dominio, variedad y carga de la sesión. Cada recomendación mostrará una razón breve. Es más fácil de validar, depurar y utilizar offline.

#### 3.3 Dominio centrado en el binomio

El progreso pertenece a la relación entre guía y perro, no solo al usuario o a la señal. El modelo deberá admitir múltiples perros, y cada ejecución, valoración y recomendación quedará asociada al perro correcto y a la versión de la señal practicada.

#### 3.4 Contenido reglamentario versionado

La RSCE mantiene reglamentos y señales nacionales, mientras que la FCI publica reglas internacionales, descripciones de señales y normas de construcción de pistas por separado. El sistema deberá conservar como mínimo autoridad, ámbito, versión, fecha de vigencia, idioma y URL de origen. Fuentes de referencia verificadas: [reglamento RSCE vigente publicado para 2026](https://www.rsce.es/wp-content/uploads/2026/01/reglamento_rally_obedience_2026.pdf), [documentación oficial de Rally Obedience de la RSCE](https://www.rsce.es/tipo-de-reglamentos/rally-obediencia/) y [documentación oficial de Rally Obedience de la FCI](https://www.fci.be/es/Rally-Obedience-4746.html).

#### 3.5 Seguridad de datos visible

Exportar no será una función escondida de configuración. La aplicación deberá avisar cuando no exista una copia reciente, permitir crear una copia legible y restaurable, y explicar qué datos permanecen solo en el dispositivo.

#### 3.6 Bienestar antes que optimización

Las recomendaciones serán orientativas y configurables. Deberán permitir pausar, sustituir o finalizar una sesión; evitarán castigos y objetivos médicos; y tendrán en cuenta duración, descansos y señales de fatiga declaradas por el guía. La aplicación no sustituirá a un profesional veterinario ni a un instructor cualificado.

---

## Versión definitiva: Resumen ejecutivo

Rally O Trainer será una Progressive Web App mobile-first y local-first para guías que entrenan Rally Obedience conforme a los reglamentos RSCE y FCI. Su propósito no es digitalizar un reglamento ni presentar una colección de señales, sino convertir información reglamentaria e historial de práctica en decisiones de entrenamiento concretas.

En el momento de entrenar, la aplicación deberá responder con rapidez a cuatro preguntas:

1. ¿Qué conviene entrenar ahora con este perro?
2. ¿Cómo debe ejecutarse y entrenarse cada habilidad?
3. ¿Cuándo conviene repetirla?
4. ¿Está mejorando el binomio de forma consistente?

El producto se diseñará para el contexto más exigente: un guía en pista, usando un teléfono con una sola mano y con un perro esperando. Las tareas principales —iniciar una sesión, consultar una señal, registrar un resultado y ver la siguiente recomendación— deberán ser comprensibles a primera vista, tolerar interrupciones y requerir un máximo de tres pulsaciones desde un punto de entrada razonable. Las acciones destructivas o infrecuentes quedan fuera de esta restricción cuando añadir confirmación mejore la seguridad.

### Propuesta de valor

> Rally O Trainer transforma el reglamento y el historial del binomio en un plan de entrenamiento breve, comprensible y accionable, disponible incluso sin conexión.

La diferenciación no dependerá de reunir más contenido que otras soluciones. Dependerá de reducir la incertidumbre del guía antes, durante y después de entrenar:

- **Antes:** propone una sesión adecuada al perro, objetivo y tiempo disponible.
- **Durante:** muestra instrucciones esenciales y permite registrar el resultado con mínima fricción.
- **Después:** resume lo practicado, actualiza el nivel estimado y programa el siguiente repaso.
- **A medio plazo:** revela tendencias, puntos débiles y preparación para un grado o competición.

### Usuario y contexto prioritarios

El usuario primario es un guía deportivo de Rally Obedience que entrena uno o varios perros y utiliza habitualmente un teléfono móvil en pista. Puede ser principiante o competidor, pero comparte estas necesidades:

- empezar a entrenar sin configurar un sistema complejo;
- consultar información fiable sin abandonar la sesión;
- registrar resultados con una mano;
- recibir orientación sin perder autonomía;
- conservar y trasladar sus datos sin depender de una cuenta.

Tabletas y ordenadores serán plataformas compatibles para planificación, revisión y gestión detallada. No determinarán la interfaz principal mientras entrenar con móvil siga siendo el caso de uso crítico.

### Resultado de producto esperado

El producto tendrá éxito cuando ayude a entrenar mejor con menos preparación y no cuando maximice tiempo de pantalla. Las métricas se definirán por resultados y se validarán con investigación; los valores siguientes son objetivos iniciales, no hechos demostrados:

| Resultado | Indicador inicial | Objetivo de diseño |
|---|---|---:|
| Empezar sin fricción | Tiempo mediano desde abrir la app hasta iniciar una sesión recomendada | ≤ 30 segundos |
| Registrar sin interrumpir | Acciones para valorar un ejercicio durante una sesión | 1 acción habitual; máximo 2 |
| Completar el ciclo | Sesiones iniciadas que terminan con al menos un resultado guardado | ≥ 80 % |
| Generar confianza | Recomendaciones que muestran motivo y permiten sustitución | 100 % |
| Mantener control de datos | Usuarios activos con copia o exportación reciente | Métrica a validar tras pruebas |
| Mejorar la consistencia | Habilidades que progresan y se mantienen en revisiones posteriores | Métrica a definir con el modelo de dominio |
| Evitar dependencia de red | Tareas principales ejecutables en modo avión tras la instalación inicial | 100 % |

No se usarán como métricas principales el tiempo dentro de la aplicación, el número bruto de pantallas vistas ni la cantidad de notificaciones enviadas.

### Alcance del primer producto útil

El MVP deberá cerrar un ciclo completo de entrenamiento, aunque su algoritmo sea sencillo:

```mermaid
flowchart LR
    A["Elegir perro y objetivo"] --> B["Recibir sesión sugerida"]
    B --> C["Consultar instrucciones esenciales"]
    C --> D["Entrenar y registrar resultado"]
    D --> E["Actualizar dominio e historial"]
    E --> F["Programar próximo repaso"]
    F --> B
```

El alcance mínimo incluirá:

- incorporación breve y utilizable sin cuenta;
- uno o varios perfiles de perro sobre un modelo de datos múltiple;
- biblioteca de señales correspondiente al alcance reglamentario seleccionado para el lanzamiento;
- contenido con fuente y versión identificables;
- sesiones manuales y sesiones sugeridas por un motor de reglas;
- registro rápido de ejecución, dificultad percibida y notas opcionales;
- historial y estadísticas esenciales por perro, señal y periodo;
- programación básica de repaso;
- funcionamiento offline de todas las tareas principales;
- exportación, copia de seguridad y restauración verificables;
- temas claro y oscuro con accesibilidad equivalente;
- instalación PWA cuando la plataforma lo permita y guía contextual cuando no sea automática.

No formarán parte del MVP:

- red social, mensajería o clasificaciones públicas;
- cursos de pago o marketplace;
- gestión de clubes, cuotas o economía;
- sincronización obligatoria o cuenta de usuario obligatoria;
- recomendaciones generadas por modelos de IA remotos;
- vídeo alojado como requisito para entrenar;
- colaboración en tiempo real;
- promesas de diagnóstico médico, conductual o veterinario;
- constructor avanzado de pistas, salvo que la investigación demuestre que es imprescindible para cerrar el ciclo inicial.

### Dirección funcional

La experiencia se organizará alrededor de tareas y no de una colección de módulos. La pantalla inicial deberá priorizar el perro activo, la siguiente acción y la continuidad de una sesión interrumpida. Biblioteca, historial, estadísticas y configuración serán capacidades de apoyo.

La navegación exacta queda pendiente de arquitectura de información y pruebas de usabilidad. La lista actual de siete áreas no se aprueba todavía como barra de navegación. En móvil se favorecerán entre tres y cinco destinos persistentes, acciones primarias alcanzables con el pulgar y accesos contextuales desde la sesión.

### Dirección técnica

La arquitectura deberá cumplir los siguientes límites, que se detallarán en capítulos posteriores:

- **PWA local-first:** shell de aplicación y datos esenciales disponibles sin red después de la primera carga completa.
- **Persistencia estructurada:** almacenamiento transaccional local adecuado para relaciones, versiones y migraciones; no depender exclusivamente de pares clave-valor simples.
- **Dominio independiente de la interfaz:** señales, reglamentos, sesiones, resultados, perfiles y recomendaciones deberán poder evolucionar sin acoplarse a una pantalla concreta.
- **Contenido separado del código:** los cambios reglamentarios no deberán exigir reescribir componentes ni perder históricos.
- **Versionado y migraciones:** cada esquema local y paquete de contenido tendrá versión explícita y proceso de actualización recuperable.
- **Sin backend obligatorio:** el MVP funcionará sin servidor de usuario. La arquitectura dejará puntos de extensión para sincronización futura sin imponerlos al modelo local.
- **Portabilidad:** exportación completa en un formato documentado, además de una presentación legible cuando resulte útil.
- **Observabilidad respetuosa:** cualquier telemetría será opcional, mínima, agregada cuando sea posible y nunca requisito para la función principal.

La selección de framework, gestor de estado, base de datos local y estrategia de service worker se decidirá tras comparar compatibilidad, mantenibilidad, tamaño, soporte de migraciones y comportamiento real en Safari/iOS. No se aprobará una tecnología únicamente por popularidad.

### Principios operativos

Toda decisión posterior se evaluará mediante esta matriz:

| Principio | Pregunta de control |
|---|---|
| Rapidez | ¿Reduce el tiempo entre la intención y el entrenamiento? |
| Simplicidad | ¿Puede entenderse en pista sin instrucciones externas? |
| Utilidad | ¿Ayuda a decidir, ejecutar o evaluar una acción real? |
| Resiliencia offline | ¿Sigue funcionando sin cobertura ni sesión iniciada? |
| Control del usuario | ¿Puede entender, exportar y eliminar sus datos? |
| Evolución | ¿Admite nuevos grados, perros y reglas sin rehacer el núcleo? |
| Bienestar | ¿Evita incentivar sobreentrenamiento o prácticas perjudiciales? |

Una función que no supere estas preguntas deberá simplificarse, posponerse o eliminarse.

### Criterios globales de salida del MVP

El MVP no estará listo solo porque sus pantallas existan. Deberá demostrar que:

- [ ] un usuario nuevo puede crear un perro e iniciar una primera sesión sin cuenta;
- [ ] un usuario recurrente puede iniciar la sesión recomendada en un máximo de tres pulsaciones;
- [ ] una sesión completa puede ejecutarse en modo avión;
- [ ] cerrar o recargar la aplicación durante una sesión no provoca pérdida de datos confirmados;
- [ ] cada señal visible identifica el conjunto reglamentario y su versión;
- [ ] cada recomendación explica de forma breve por qué aparece;
- [ ] el usuario puede sustituir, omitir o finalizar ejercicios sin penalización artificial;
- [ ] una copia exportada puede restaurarse en una instalación limpia y conserva relaciones e históricos;
- [ ] la interfaz principal es operable con una mano en los tamaños móviles admitidos;
- [ ] navegación, contraste, foco, tamaño táctil y lectores de pantalla superan el plan de accesibilidad acordado;
- [ ] las pruebas de rendimiento cumplen los presupuestos definidos en dispositivos representativos;
- [ ] no existe dependencia silenciosa de una API o conexión para tareas principales.

## Registro de decisiones de este capítulo

| ID | Decisión | Estado |
|---|---|---|
| DE-001 | El producto será local-first y no requerirá cuenta para su función principal. | Aprobada el 5 de agosto de 2026 |
| DE-002 | El MVP incluirá recomendación y repaso básicos mediante reglas explicables. | Aprobada el 5 de agosto de 2026 |
| DE-003 | El dominio admitirá múltiples perros desde la primera versión del esquema. | Aprobada el 5 de agosto de 2026 |
| DE-004 | Reglamentos y señales serán contenido versionado y trazable. | Aprobada el 5 de agosto de 2026 |
| DE-005 | La navegación inicial de siete áreas no se considera aprobada. | Aprobada el 5 de agosto de 2026 |
| DE-006 | Exportación, copia y restauración forman parte de la seguridad del MVP. | Aprobada el 5 de agosto de 2026 |
| DE-007 | El bienestar canino será un criterio transversal del producto y del planificador. | Aprobada el 5 de agosto de 2026 |

## Riesgos

| Riesgo | Impacto | Probabilidad inicial | Mitigación propuesta |
|---|---|---:|---|
| Convertir el MVP en una biblioteca con métricas superficiales | Alto | Alta | Exigir un ciclo completo de recomendación, ejecución, evaluación y repaso. |
| Interpretar incorrectamente o desactualizar el reglamento | Alto | Media | Revisión experta, fuentes oficiales, versionado y fecha de vigencia visible. |
| Pérdida de datos por límites del almacenamiento web | Alto | Media | Persistencia solicitada cuando proceda, copias guiadas, exportación y pruebas de restauración. |
| Diferencias de PWA en iOS | Alto | Alta | Matriz de capacidades por plataforma, pruebas tempranas en dispositivos reales y degradación explícita. |
| Registrar durante el ejercicio distrae al guía o al perro | Alto | Media | Interacciones de un toque, valores predeterminados prudentes y registro posterior opcional. |
| Algoritmo opaco o recomendaciones poco útiles | Alto | Media | Motor determinista, razones visibles, sustitución y recogida de feedback. |
| Modelo demasiado genérico para nuevos grados | Medio | Media | Separar reglamentos, señales, habilidades y ejecuciones; probar con varios grados antes de cerrar el esquema. |
| Sobreingeniería para una sincronización futura | Medio | Alta | Mantener interfaces y versiones claras sin construir infraestructura remota antes de necesitarla. |
| Recomendaciones que incentiven repetición excesiva | Alto | Media | Límites de carga, descansos, control del guía y criterios de bienestar revisados por especialistas. |
| Objetivos de rendimiento sin dispositivo de referencia | Medio | Alta | Definir hardware, red y percentil antes de aceptar la métrica de dos segundos. |

## Mejoras posibles

Estas mejoras no quedan aprobadas para el MVP; deberán demostrar valor y coste sostenible:

- adaptar duración y dificultad a la energía o estado declarado del perro;
- incorporar recordatorios locales configurables y no manipulativos;
- añadir constructor de pistas con validación reglamentaria;
- ofrecer importación de paquetes oficiales firmados o verificados;
- permitir sincronización cifrada y opcional entre dispositivos;
- facilitar modos de instructor sin convertir el producto en una red social;
- añadir vídeo local vinculado a una ejecución, sujeto a almacenamiento y privacidad;
- comparar periodos o perros sin crear rankings de bienestar dudoso;
- internacionalizar reglas y contenido conservando sus jurisdicciones y fuentes.

## Decisiones pendientes

| ID | Decisión | Por qué no se cierra en este capítulo | Responsable propuesto | Momento límite |
|---|---|---|---|---|
| DP-001 | Grados y conjunto reglamentario exactos del MVP | Requiere inventario de contenido, audiencia objetivo y revisión experta. | Producto + especialista Rally Obedience | Antes del modelo de datos definitivo |
| DP-002 | Soporte visible para varios perros en el MVP | El modelo será múltiple; falta validar complejidad de la experiencia inicial. | Producto + UX | Antes de cerrar flujos |
| DP-003 | Escala de valoración de una ejecución | Debe ser rápida y producir datos útiles, sin falsa precisión. | Producto + especialista + datos | Antes del prototipo interactivo |
| DP-004 | Definición operativa de “dominio” y “progreso” | Determina estadísticas y algoritmo de repaso. | Producto + especialista | Antes del planificador |
| DP-005 | Navegación principal | Debe derivarse del mapa de tareas y probarse con una mano. | UX/UI | Antes del diseño de alta fidelidad |
| DP-006 | Stack frontend y persistencia local | Requiere una comparación técnica y pruebas en Safari/iOS. | Arquitectura + frontend | Antes del primer incremento técnico |
| DP-007 | Formatos de exportación y copia | Deben equilibrar legibilidad, restauración íntegra y evolución del esquema. | Arquitectura + producto | Antes de implementar persistencia |
| DP-008 | Presupuestos de rendimiento y dispositivos de referencia | “Menos de dos segundos” carece de condiciones medibles. | Frontend + QA | Antes de pruebas de rendimiento |
| DP-009 | Proceso de validación y actualización del contenido oficial | Requiere definir responsable editorial y frecuencia. | Producto + asesor reglamentario | Antes de publicar contenido |
| DP-010 | Política de telemetría opcional | Debe respetar la promesa de privacidad y permitir validar el producto. | Producto + seguridad | Antes de instrumentación |
