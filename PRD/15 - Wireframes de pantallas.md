# PRD — Capítulo 15: Wireframes de todas las pantallas

| Campo | Valor |
|---|---|
| Producto | Rally O Trainer |
| Estado | Wireframes funcionales actualizados |
| Fecha | 6 de agosto de 2026 |
| Dispositivo principal | iPhone 16 Pro en vertical |
| Adaptación | Android, iPad, Mac y PC |
| Dependencias | Capítulos 05 y 09–14 |
| Próximo capítulo | Sistema de diseño y guía de estilo |

> Los wireframes describen jerarquía, contenido, acciones y estados. No fijan todavía colores, tipografía final ni ilustraciones.

---

## Análisis previo

### Hipótesis revisadas

| Hipótesis | Problema | Resolución |
|---|---|---|
| Siete secciones requieren siete iconos siempre visibles | No caben con claridad en móvil | Navegación inferior de cuatro destinos y acceso contextual al resto |
| Toda pantalla necesita cabecera completa | Reduce espacio útil | Cabecera mínima según contexto |
| El botón principal puede cambiar de lugar | Dificulta uso con una mano | Acciones primarias en zona inferior consistente |
| Un modal sirve para cualquier tarea | Puede fallar con teclado y accesibilidad | Pantallas completas para tareas complejas; hojas solo para elecciones breves |
| Escritorio debe tener una interfaz distinta | Duplica diseño | Mismo modelo con navegación lateral y ancho contenido limitado |

### Puntos débiles detectados

- La sesión activa necesita una interfaz distinta del resto de la app.
- Las áreas seguras de iPhone reducen la zona inferior disponible.
- Las pantallas de reglamento y señal contienen mucho texto.
- Configuración y datos reúnen acciones peligrosas y normales.
- Constructor de pistas no debe condicionar el MVP móvil.

### Mejoras propuestas

1. Cuatro destinos principales: Inicio, Entrenar, Señales y Progreso.
2. Perros y Configuración desde cabecera/perfil, accesibles en dos pulsaciones.
3. Sesión activa sin navegación global.
4. Una acción primaria por pantalla.
5. Componentes adaptativos, no pantallas duplicadas por plataforma.

---

## Versión definitiva

### 1. Shell de aplicación

#### Móvil

```text
┌──────────────────────────┐
│ Rally O Trainer    Luna ▾│  cabecera
├──────────────────────────┤
│                          │
│      contenido           │
│                          │
├──────────────────────────┤
│ Inicio Entrenar Señales  │
│          Progreso        │  navegación inferior
└──────────────────────────┘
```

La navegación inferior se oculta durante sesión, incorporación, restauración y confirmaciones destructivas.

#### Tableta y escritorio

```text
┌──────────────┬─────────────────────────────────┐
│ marca        │ cabecera / perro                │
│ Inicio       ├─────────────────────────────────┤
│ Entrenar     │                                 │
│ Señales      │ contenido con ancho legible     │
│ Progreso     │                                 │
│ Perros       │                                 │
│ Ajustes      │                                 │
└──────────────┴─────────────────────────────────┘
```

### 2. Inventario de pantallas

| ID | Pantalla | Pregunta principal |
|---|---|---|
| W01 | Bienvenida | ¿Qué es esta aplicación? |
| W02 | Crear perro | ¿Con qué perro entrenaré? |
| W03 | Inicio | ¿Qué debería hacer ahora? |
| W04 | Selector de perro | ¿Con qué perro estoy trabajando? |
| W05 | Entrenar | ¿Acepto la recomendación o elijo otra señal? |
| W06 | Preparación | ¿Tengo listo lo necesario? |
| W07 | Sesión activa | ¿Cómo registro esta repetición? |
| W08 | Sesión pausada | ¿Continúo o termino? |
| W09 | Cierre | ¿Cómo finalizo de forma positiva? |
| W10 | Resumen de sesión | ¿Qué ocurrió y cuál es el siguiente paso? |
| W11 | Biblioteca | ¿Qué señal quiero consultar? |
| W12 | Ficha de señal | ¿Qué significa y cómo se entrena? |
| W13 | Progreso | ¿Qué está aprendido y qué necesita atención? |
| W14 | Historial | ¿Qué entrené? |
| W15 | Detalle de sesión | ¿Qué datos registré exactamente? |
| W16 | Lista de perros | ¿Qué perros gestiono? |
| W17 | Perfil/editar perro | ¿Qué datos básicos tiene este perro? |
| W18 | Configuración | ¿Qué preferencias puedo cambiar? |
| W19 | Datos y copias | ¿Cómo protejo o traslado mis datos? |
| W20 | Restaurar copia | ¿Qué contiene el archivo y quiero sustituir? |
| W21 | Diagnóstico y fuentes | ¿Qué versiones y fuentes usa la aplicación? |
| W22 | Constructor — lista | ¿Es compatible esta secuencia? |
| W23 | Constructor — añadir señal | ¿Qué señal añado? |
| W24 | Práctica de recorrido | ¿Cómo registro cada estación? |
| W25 | Modo examen | ¿Qué quiero repasar? |
| W26 | Pregunta de examen | ¿Cuál es la respuesta y por qué? |
| W27 | Resultado de examen | ¿Qué errores debo repasar? |

### 3. W01 — Bienvenida

```text
┌──────────────────────────┐
│          logotipo        │
│ Rally O Trainer          │
│ Aprende · practica ·     │
│ progresa                 │
│                          │
│ Entrenamientos de 15 min │
│ Funciona sin conexión    │
│ Tus datos se quedan aquí │
│                          │
│ [ Empezar ]              │
│ Ver fuentes y aviso      │
└──────────────────────────┘
```

- Sin carrusel.
- Sin solicitud de registro, notificaciones o instalación.
- `Empezar` lleva a W02.

### 4. W02 — Crear perro

```text
┌──────────────────────────┐
│ ←  Añade tu perro        │
│                          │
│ Nombre                   │
│ [____________________]   │
│ Raza                     │
│ [____________________]   │
│ Puedes escribir mestizo. │
│                          │
│ [ Guardar y continuar ]  │
└──────────────────────────┘
```

- Teclado no tapa la acción; la acción puede desplazarse con contenido.
- Validación al salir del campo y al enviar.
- No solicita foto.

### 5. W03 — Inicio

```text
┌──────────────────────────┐
│ Rally O Trainer    Luna ▾│
│ Buenos días              │
│                          │
│ HOY                      │
│ Giro a la derecha        │
│ Repaso · lado derecho    │
│ 31 días sin practicar    │
│ Casa · sin material      │
│ [ Preparar sesión ]      │
│ Cambiar señal            │
│                          │
│ Necesitan repaso      3 ›│
│ Última sesión      Ayer ›│
├──────────────────────────┤
│ Inicio Entrenar Señales  │
│          Progreso        │
└──────────────────────────┘
```

Estados alternativos:

- sesión activa: `Continuar sesión` sustituye la recomendación;
- sin perro: acción de crear y biblioteca consultable;
- sin historial: primera sesión accesible;
- copia vencida: aviso pequeño bajo el contenido, nunca encima de sesión activa.

### 6. W04 — Selector de perro

Hoja inferior breve:

```text
┌──────────────────────────┐
│ Perro activo             │
│ ● Luna                   │
│ ○ Trasto                 │
│                          │
│ + Añadir perro           │
│ Gestionar perros         │
└──────────────────────────┘
```

Seleccionar cierra la hoja y recalcula la pantalla actual.

### 7. W05 — Seleccionar señales

```text
┌──────────────────────────┐
│ Nueva sesión      Luna ▾ │
│                          │
│ Selecciona las señales   │
│ [ Buscar número/nombre ] │
│ [ Grado ▾ ][ Área ▾ ]    │
│ 2 seleccionadas          │
│                          │
│ [img] 101 · Tumbado   ✓  │
│       Debutante · A      │
│ [img] 102 · Pausa...  ✓  │
│       Debutante · A      │
│ [img] 103 · Rodear    +  │
│                          │
│ [ Continuar con 2 ]      │
└──────────────────────────┘
```

La lista completa es virtualmente desplazable. La acción queda fija sobre la navegación inferior y el filtrado no pierde selecciones previas.

### 8. W06 — Elegir modalidad

```text
┌──────────────────────────┐
│ ← Cambiar selección      │
│ ¿Cómo quieres entrenar?  │
│ 2 señales · 10 intentos  │
│ [101] [102]              │
│                          │
│ Lugar     [ Casa ▾ ]     │
│                          │
│ ┌──────────────────────┐ │
│ │ 10×  Por repetición  │ │
│ │ Diez seguidas/señal  │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ ↻    En circuito     │ │
│ │ Diez vueltas         │ │
│ └──────────────────────┘ │
│ Descanso cada 15 min     │
└──────────────────────────┘
```

### 9. W07 — Sesión activa

```text
┌──────────────────────────┐
│ Pausar   CIRCUITO  Final.│
│ Vuelta 1/10   Señal 1/2  │
│ ▬▬▬▬▬░░░░░░░░░░░░░░░░░ │
│                          │
│ 101  Tumbado             │
│ ┌──────────────────────┐ │
│ │   SEÑAL OFICIAL      │ │
│ └──────────────────────┘ │
│ Descripción breve...     │
│                          │
│ [ × Incorrecta ][✓ Corr.]│
│ [ Deshacer último ]      │
│                          │
│ Impresiones y notas +    │
└──────────────────────────┘
```

- Los dos botones ocupan la zona inferior útil y no cambian de orden.
- La señal oficial debe verse completa sin zoom en iPhone 16 Pro.
- El avance ocurre inmediatamente y Deshacer recupera el paso anterior.

### 10. W08 — Sesión pausada

```text
┌──────────────────────────┐
│ Sesión pausada           │
│ Momento de recuperar     │
│ El tiempo de pausa no    │
│ cuenta como entrenamiento│
│                          │
│ [ Reanudar sesión ]      │
│ [ Finalizar sesión ]     │
└──────────────────────────┘
```

El aviso automático de 15 minutos usa el mismo patrón, con `Iniciar descanso` y `Continuar sin descanso`.

### 11. W09 — Impresiones

```text
┌──────────────────────────┐
│ Impresiones y notas      │
│                          │
│ [Muy concentrado]        │
│ [Buena motivación]       │
│ [Se distrae] [Fatiga]    │
│                          │
│ Nota general             │
│ [......................] │
│                          │
│ Nota de señal 101        │
│ [......................] │
└──────────────────────────┘
```

### 12. W10 — Resumen

```text
┌──────────────────────────┐
│ Resumen · Luna           │
│ 70% · 18:20 · 1 descanso│
│                          │
│ [101] 7/10  SUPERADA     │
│ [102] 6/10  PENDIENTE    │
│                          │
│ [ Guardar sesión ]       │
│ [ Continuar entrenando ] │
│ [ Repetir pendientes ]   │
│ Descartar sesión         │
└──────────────────────────┘
```

### 13. W11 — Biblioteca

```text
┌──────────────────────────┐
│ Señales           Luna ▾ │
│ [ RSCE ] [ FCI ]         │
│ [Recomendadas] [Todas]   │
│ [ Buscar número/nombre ] │
│ Debut.  G1  G2  G3      │
│ Filtros (1)      Limpiar │
│                          │
│ [señal oficial] 101 Nombre│
│                 Repaso  ›│
│ 102 Nombre…  En progreso›│
│ 103 Nombre… Sin practicar›
├──────────────────────────┤
│ Inicio Entrenar Señales  │
│          Progreso        │
└──────────────────────────┘
```

Los chips de grado pueden convertirse en un selector si no caben a 320 px.

### 14. W12 — Ficha de señal

```text
┌──────────────────────────┐
│ ← 101 · Nombre     RSCE  │
│ Estado: en progreso      │
│ [señal oficial + fuente] │
│                          │
│ EN POCAS PALABRAS        │
│ explicación…             │
│                          │
│ OBSERVA                  │
│ 1… 2… 3…                 │
│                          │
│ CÓMO ENTRENARLA          │
│ consejo…                 │
│                          │
│ Descripción reglamentaria│
│ Preparación              │
│ Progreso por lado        │
│ Fuente y revisión        │
│                          │
│ [ Practicar esta señal ] │
└──────────────────────────┘
```

Las secciones inferiores pueden plegarse, pero fuente y descripción son accesibles sin menú.

### 15. W13 — Progreso

```text
┌──────────────────────────┐
│ Progreso          Luna ▾ │
│ [ RSCE ▾ ] [ Debutante ▾]│
│                          │
│ Necesitan repaso       3›│
│ En progreso            8›│
│ Aprendidas            12›│
│ Consolidadas           4›│
│                          │
│ Actividad reciente       │
│ gráfico accesible        │
│                          │
│ Ver historial          › │
└──────────────────────────┘
```

No hay porcentaje heroico ni comparación con otros perros.

### 16. W14 y W15 — Historial y detalle

```text
┌──────────────────────────┐
│ ← Historial       Luna ▾ │
│ [30 días ▾] [Señal ▾]   │
│                          │
│ Hoy 18:10 · 12 min     › │
│ Giro derecha · 5 autón.  │
│ Ayer 10:30 · 8 min     › │
│ Posición base · finalizó │
└──────────────────────────┘
```

Detalle:

```text
┌──────────────────────────┐
│ ← Sesión · 5 ago         │
│ Luna · Casa · Repasar    │
│ 12 min · Adecuada        │
│                          │
│ BLOQUE 1 · lado derecho  │
│ 1 autónomo  2 ayuda …    │
│                          │
│ Motivo y nota            │
│ [ Repetir señal ]        │
│ Eliminar sesión          │
└──────────────────────────┘
```

### 17. W16 y W17 — Perros

Lista:

```text
┌──────────────────────────┐
│ ← Perros                 │
│ Luna · Border Collie   › │
│ Trasto · Mestizo       › │
│                          │
│ [ Añadir perro ]         │
│ Ver archivados           │
└──────────────────────────┘
```

Perfil:

```text
┌──────────────────────────┐
│ ← Luna             Editar│
│ Border Collie             │
│ Próxima: giro derecha   › │
│ Última sesión: ayer     › │
│ Progreso               › │
│                          │
│ Archivar perro           │
│ Borrar definitivamente   │
└──────────────────────────┘
```

### 18. W18 — Configuración

```text
┌──────────────────────────┐
│ ← Configuración          │
│ Apariencia             › │
│ Entrenamiento          › │
│ Material disponible    › │
│ Datos y copias         › │
│ Fuentes y aplicación   › │
│ Ayuda                  › │
└──────────────────────────┘
```

No hay una zona de peligro visible en el primer nivel.

### 19. W19 y W20 — Datos y restauración

```text
┌──────────────────────────┐
│ ← Datos y copias         │
│ Última copia: 6 jul      │
│ [ Crear copia completa ] │
│ [ Restaurar copia ]      │
│ Exportar datos legibles ›│
│                          │
│ ZONA DE PELIGRO          │
│ Borrar todos los datos › │
└──────────────────────────┘
```

Previsualización de restauración:

```text
┌──────────────────────────┐
│ Restaurar copia          │
│ 2 perros · 84 sesiones   │
│ Creada: 1 ago 2026       │
│ Compatible: Sí           │
│                          │
│ Sustituirá todos los     │
│ datos actuales.          │
│ [ Crear copia previa ]   │
│ [ Restaurar y sustituir ]│
│ Cancelar                 │
└──────────────────────────┘
```

### 20. W21 — Diagnóstico y fuentes

Lista legible de versiones, integridad, almacenamiento y enlaces. Acción primaria `Comprobar datos`; `Actualizar` aparece solo si hay versión pendiente y no hay sesión activa.

### 21. W22–W24 — Constructor y recorrido

Constructor:

```text
┌──────────────────────────┐
│ ← Recorrido RO1    Revisar│
│ 12/12 · Grupo 2: 6/7     │
│ Falta 1 señal del grupo 2│
│ 1  START               ⋮ │
│ 2 [señal oficial] 101    │
│   Nombre              ⋮  │
│ 3  204 Nombre          ⋮ │
│ ...                      │
│ [ Añadir señal ]         │
│ [ Practicar recorrido ]  │
└──────────────────────────┘
```

Añadir señal reutiliza búsqueda de biblioteca limitada al grado y explica por qué una opción no es válida.

Práctica:

```text
┌──────────────────────────┐
│ Estación 3 de 12         │
│ 204 · Nombre             │
│ [Incorrecto][Ayuda][Auto]│
│                          │
│ Anterior       Siguiente │
│ Finalizar recorrido      │
└──────────────────────────┘
```

### 22. W25–W27 — Examen

Inicio:

```text
┌──────────────────────────┐
│ Modo examen              │
│ ¿Qué quieres repasar?    │
│ [ Mi grado recomendado ] │
│ [ Errores anteriores ]   │
│ [ Elegir grado ]         │
│ 5 preguntas · sin tiempo │
└──────────────────────────┘
```

Pregunta:

```text
┌──────────────────────────┐
│ Pregunta 2 de 5          │
│ [señal oficial + fuente] │
│ ¿Qué debe hacer el perro?│
│ ( ) Respuesta A          │
│ ( ) Respuesta B          │
│ ( ) Respuesta C          │
│ [ Comprobar ]            │
│ Explicación tras responder│
└──────────────────────────┘
```

### 23. Diálogos y hojas

Se permiten hojas inferiores para:

- perro activo;
- ubicación;
- objetivo;
- lado;
- filtros breves;
- pausa.

Se usan pantallas completas para:

- crear/editar perro;
- preparación;
- sesión;
- restauración;
- borrado definitivo;
- ficha de señal;
- detalle de sesión.

### 24. Estados globales

#### Sin conexión

La app sigue funcionando. Solo los enlaces externos muestran “Disponible cuando tengas conexión”.

#### Actualización pendiente

Banner pequeño fuera de sesión: `Nueva versión lista · Actualizar`. Nunca recarga automáticamente.

#### Almacenamiento en riesgo

Aviso con acción `Crear copia`; no bloquea el acceso a datos.

#### Error recuperable

Mensaje específico, acción de reintento y acceso a diagnóstico. Evitar “Algo salió mal” sin explicación.

### 25. Adaptación responsive

| Ancho | Comportamiento |
|---|---|
| 320–599 px | Una columna, navegación inferior, acciones a ancho completo |
| 600–899 px | Contenido principal hasta 680 px; paneles secundarios opcionales |
| ≥900 px | Navegación lateral; contenido 720–960 px según tarea |

En escritorio, texto de lectura no supera aproximadamente 72 caracteres por línea. El constructor puede usar más ancho.

### 26. Criterios de aceptación

- [ ] Cada pantalla responde a una pregunta principal.
- [ ] Toda acción importante se alcanza en menos de tres pulsaciones.
- [ ] La sesión activa no muestra navegación global.
- [ ] Correcta e Incorrecta permanecen en orden y posición.
- [ ] Atrás nunca descarta datos sin avisar.
- [ ] Ninguna tarea depende solo de arrastrar o deslizar.
- [ ] Las acciones destructivas están separadas.
- [ ] El teclado no oculta el envío.
- [ ] Funciona desde 320 px sin desplazamiento horizontal global.
- [ ] Se respetan áreas seguras de iPhone.
- [ ] Tableta y escritorio conservan la misma arquitectura.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Cuatro destinos no exponen Perros/Ajustes | Selector de perro y accesos de cabecera en dos pulsaciones |
| Barra fija tapa contenido | Espaciado inferior y áreas seguras |
| Ficha demasiado extensa | Jerarquía por utilidad y secciones secundarias |
| Chips no caben a 320 px | Selector adaptativo |
| Constructor móvil incómodo | Lista primero y escritorio para plano avanzado |

## Mejoras posibles

- Prototipo navegable de alta fidelidad.
- Pruebas de alcance del pulgar en iPhone 16 Pro.
- Pruebas con TalkBack y VoiceOver.
- Modo apaisado específico para constructor.
- Acciones rápidas del sistema operativo si aportan valor.

## Decisiones pendientes

| ID | Decisión | Momento límite |
|---|---|---|
| DP-15-001 | Chips o selector para grado en 320 px | Prototipo visual |
| DP-15-002 | Segunda confirmación de borrado: texto o pulsación mantenida | Prueba de accesibilidad |
| DP-15-003 | Ubicación exacta de Ajustes en cabecera móvil | Prototipo de shell |
| DP-15-004 | Mostrar constructor en navegación principal cuando se implemente | Versión 2 |
