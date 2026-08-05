# PRD — Capítulo 19: Registro de decisiones y estado de implementación

| Campo | Valor |
|---|---|
| Producto | Rally O Trainer |
| Estado | Registro consolidado v1 |
| Fecha | 6 de agosto de 2026 |
| Autoridad de producto | Propietario del proyecto |
| Propósito | Resolver ambigüedades entre decisiones iniciales, capítulos y código |

---

## Análisis previo

Los capítulos se redactaron de forma progresiva y conservan hipótesis, alternativas y decisiones pendientes de su momento. Eso aporta trazabilidad, pero puede inducir a un desarrollador a tratar como vigente una hipótesis ya resuelta. La solución más simple no es reescribir retrospectivamente todo el análisis, sino mantener un registro final que prevalezca sobre propuestas anteriores cuando exista contradicción.

El estado de implementación distingue cuatro términos:

- **aprobada**: decisión de producto vigente;
- **implementada**: existe código o contenido verificable;
- **preparada**: existe un borrador completo, todavía no publicable;
- **pendiente externa**: exige decisión, revisión o dispositivo del propietario.

---

## Versión definitiva

### 1. Decisiones vigentes

| ID | Decisión | Estado |
|---|---|---|
| D-001 | Nombre final **Rally O Trainer** | Aprobada e implementada |
| D-002 | Proyecto personal, no comercial y sin presupuesto | Aprobada |
| D-003 | PWA local-first, sin cuenta, publicidad, backend ni telemetría | Aprobada e implementada |
| D-004 | Prioridad editorial RSCE; FCI en ámbito separado y relacionado | Aprobada e implementada |
| D-005 | Alcance reglamentario hasta RSCE Grado 3 y clase internacional FCI | Aprobada; base completa preparada |
| D-006 | Consulta abierta; progresión y prerrequisitos orientan, no bloquean selección manual | Aprobada e implementada |
| D-007 | Progresión y evidencia independientes por perro y lado | Aprobada e implementada |
| D-008 | Perfil mínimo: nombre y raza; varios perros | Aprobada e implementada |
| D-009 | Sesión individual de máximo 15 min: 2 activación, 10–11 trabajo y 2–3 cierre | Aprobada e implementada |
| D-010 | Una sola sesión activa por instalación y recuperación al volver | Aprobada e implementada |
| D-011 | Registro principal con Incorrecta, Con ayuda y Autónoma | Aprobada e implementada |
| D-012 | Ayudas: verbal adicional, gesto, señuelo, correa, posición u otra | Aprobada e implementada como dato opcional de cierre |
| D-013 | Aprendida: 7 autónomas de las últimas 10, en al menos dos fechas | Aprobada e implementada |
| D-014 | Consolidada: mantenimiento fuerte posterior, con 8/10, tres fechas y 14 días | Aprobada e implementada |
| D-015 | Repaso por 30 días, dos errores, ayuda recurrente, regresión o cambio incompatible | Aprobada; todos salvo cambio reglamentario automatizado están implementados |
| D-016 | Planificador por reglas explicables, sin IA remota | Aprobada e implementada |
| D-017 | Material e inventario opcionales; nunca bloquean elección manual | Aprobada e implementada |
| D-018 | Constructor primero como secuencia, no como plano libre | Aprobada e implementada para entrenamiento Debutante |
| D-019 | Modo examen separado del progreso práctico | Aprobada e implementada |
| D-020 | Repositorio público `Jquiigl/rally-o-trainer` y alojamiento gratuito mediante GitHub Actions y GitHub Pages | Aprobada, implementada y publicada |
| D-020 | Copia JSON completa, recordatorio a 30 días y restauración validada | Aprobada e implementada |
| D-021 | Borrado total con doble confirmación | Aprobada e implementada |
| D-022 | Toda referencia visible muestra la señal oficial RSCE o FCI; descripción reglamentaria propia, explicación sencilla y consejo positivo permanecen separadas | Aprobada e implementada para las 33 señales publicadas; sustituye la decisión anterior |
| D-023 | React, TypeScript, Vite, Dexie, Zod, CSS local, Vitest y PWA `generateSW` | Aprobada e implementada |
| D-024 | Colores verde bosque, dorado y marfil; icono simplificado sin texto | Aprobada e implementada |

### 2. Alcance editorial actual

| Conjunto | Total | Estado |
|---|---:|---|
| FCI Grupo 1 | 22 | Revisado y visible |
| Señales nacionales RSCE | 11 | Revisado y visible |
| FCI Grupo 2 | 22 | Borrador español completo; revisión del propietario pendiente |
| FCI Grupo 3 | 23 | Borrador español completo; revisión del propietario pendiente |
| FCI Grupo 4 | 22 | Borrador español completo; revisión del propietario pendiente |
| START y FINISH | 2 | Inventario fuente; no se tratan como ejercicio de entrenamiento individual |

La aplicación muestra el número real de fichas revisadas por grado y nunca presenta los borradores como oficiales o terminados.

Las 33 fichas publicadas incluyen su señal gráfica oficial local: 22 extraídas del PDF español de señales FCI (páginas 5–26) y 11 del reglamento RSCE 2026 (páginas 8–9). Los activos se validan en cada build y funcionan offline.

### 3. Alcance ejecutable actual

- incorporación y gestión de perros;
- recomendación por progreso, lugar, material y prerrequisitos;
- selección manual de cualquier señal revisada;
- sesión individual, temporizador, deshacer y cierre anticipado;
- historial, progreso, repaso y estadística reciente;
- biblioteca RSCE/FCI por grado;
- constructor de secuencias Debutante;
- modo examen Debutante;
- temas, material, copias, restauración y borrado total;
- instalación y recursos offline generados en producción.

No están implementadas todavía la ejecución guiada de recorridos, el constructor geométrico, vídeo, comparación avanzada, compartir, sincronización, instructor ni colaboración. Se mantienen como versiones futuras porque no son necesarias para el objetivo inmediato de planificar prácticas individuales y su coste de complejidad no está validado.

### 4. Decisiones sustituidas

| Hipótesis anterior | Decisión vigente |
|---|---|
| Nombre Rally Trainer RSCE o Rally Entrena | Rally O Trainer |
| Varios perros en versión 4 | Modelo multi-perro desde v1 |
| Planificador en versión 2 | Planificador básico desde v1 |
| Constructor como plano visual inicial | Secuencia ordenada primero |
| Siete destinos persistentes | Cuatro destinos móviles y accesos contextuales |
| Un único bloque RSCE/FCI | Pestañas separadas con relaciones y prerrequisitos |

### 5. Pendientes externas antes del piloto

- revisión y aprobación editorial de las 67 fichas de Grupos 2–4;
- recorrido completo en iPhone 16 Pro;
- elección y prueba de un Android físico;
- prueba real de instalación y modo avión;
- validación física de la publicación de GitHub Pages;
- prueba con aproximadamente cinco personas del club.

## Riesgos

- Confundir “base preparada” con “contenido publicado” podría difundir una traducción no aprobada.
- Las decisiones históricas dentro de capítulos pueden leerse sin consultar este registro.
- Un incremento posterior puede ampliar alcance sin actualizar el registro.

## Mejoras posibles

- Convertir este registro en ADR individuales si aumenta el equipo.
- Añadir versión de aplicación y enlace a commit cuando exista un primer repositorio público.
- Automatizar una página de estado a partir de validadores y paquetes.

## Decisiones pendientes

| ID | Decisión | Responsable |
|---|---|---|
| DP-19-001 | Aprobar o corregir las 67 fichas avanzadas | Propietario |
| DP-19-002 | Validar instalación y modo avión desde GitHub Pages en iPhone y Android | Propietario |
| DP-19-003 | Elegir dispositivo Android de referencia | Propietario/club |
| DP-19-004 | Decidir si el siguiente incremento prioriza ejecución de pistas o contenido avanzado publicado | Propietario tras piloto |
