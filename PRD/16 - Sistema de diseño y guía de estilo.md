# PRD — Capítulo 16: Sistema de diseño y guía de estilo

| Campo | Valor |
|---|---|
| Producto | Rally O Trainer |
| Estado | Sistema de diseño v1 |
| Fecha | 5 de agosto de 2026 |
| Referencia visual | Logotipo aportado: verde bosque, dorado y marfil |
| Dependencia | Capítulo 15 |
| Próximo capítulo | Especificación PWA y requisitos transversales |

---

## Análisis previo

### Hipótesis revisadas

| Hipótesis | Problema | Resolución |
|---|---|---|
| El logotipo completo debe aparecer en todas las pantallas | Es horizontal, detallado y consume espacio móvil | Usarlo en bienvenida/acerca de; crear símbolo simplificado para icono y cabecera |
| Dorado puede ser color principal de botones | En fondos claros presenta problemas y transmite menos estabilidad | Verde como acción principal; dorado como acento y progreso destacado |
| Una tipografía de marca debe usarse en toda la app | Reduce legibilidad y añade descarga | Tipografía del sistema para interfaz; serif solo en logotipo o títulos de marca puntuales |
| Un color por estado es suficiente | Excluye a personas con alteraciones de color | Texto, icono y forma además del color |
| Muchas animaciones hacen la app más moderna | Distraen durante entrenamiento | Movimiento corto y funcional, respetando reducción de movimiento |

### Puntos débiles detectados

- El logotipo de referencia aportado contiene el texto anterior “Rally Entrena” y no puede usarse sin adaptación.
- La ilustración detallada del perro no escala bien a 48 px.
- Verde y dorado necesitan variantes accesibles en claro y oscuro.
- Los dos resultados deben diferenciarse sin sugerir castigo o culpa.
- El sistema debe funcionar sin fuentes o iconos remotos.

### Mejoras propuestas

1. Familia de marca con logotipo completo, marca horizontal, símbolo e icono PWA.
2. Tokens semánticos independientes del tema.
3. Tipografía nativa para rapidez y offline.
4. Componentes grandes, consistentes y con estados completos.
5. Lenguaje visual sobrio, deportivo y amable, no infantil.

---

## Versión definitiva

### 1. Personalidad visual

Rally O Trainer debe sentirse:

- claro;
- sereno;
- deportivo;
- cercano;
- competente;
- respetuoso con el perro;
- útil en exterior.

Debe evitar:

- estética de red social;
- exceso de trofeos, medallas o gamificación;
- ilustraciones infantiles;
- interfaces densas de software profesional;
- imitación de materiales oficiales RSCE/FCI;
- mensajes de culpa o fracaso.

### 2. Arquitectura de marca

| Variante | Uso |
|---|---|
| Logotipo completo | Bienvenida, acerca de, documentación y material compartido |
| Marca horizontal | Cabeceras amplias y escritorio |
| Símbolo | Cabecera móvil, favicon e identificación compacta |
| Icono PWA | Pantalla de inicio, máscara y accesos del sistema |
| Monocromo | Impresión, fondos complejos y accesibilidad específica |

#### 2.1 Adaptación necesaria

El activo final deberá:

- sustituir “Rally Entrena” por “Rally O Trainer”;
- conservar el concepto perro + señal + recorrido;
- reducir detalle para tamaños pequeños;
- eliminar texto del icono PWA;
- producir versiones clara, oscura y monocroma;
- evitar usar la ilustración completa como único icono;
- conservar margen de seguridad del 12,5 % para iconos enmascarables.

El perro de la marca no implica que la aplicación esté dirigida a una raza concreta.

#### 2.2 Implementación v1

Para la PWA se ha creado un símbolo vectorial local sin texto, con perro simplificado, flecha dorada y fondo verde bosque. Se usa como favicon, cabecera e iconos de 192, 512, máscara y Apple Touch. El logotipo horizontal ilustrado continúa siendo un activo futuro; no bloquea la aplicación instalada.

### 3. Color

#### 3.1 Paleta de marca

| Token base | Valor | Uso |
|---|---|---|
| `forest-950` | `#062E24` | Fondo oscuro de marca |
| `forest-800` | `#084C3B` | Acción primaria clara |
| `forest-700` | `#0B5F49` | Interacción y énfasis |
| `forest-100` | `#DCEDE6` | Superficie suave |
| `gold-600` | `#9A6500` | Texto acentuado sobre claro |
| `gold-400` | `#E8A916` | Acento sobre oscuro |
| `gold-200` | `#F6D889` | Superficie acentuada |
| `ivory-50` | `#FFF9EC` | Fondo claro principal |
| `ivory-100` | `#FFF2D6` | Superficie de marca |
| `ink-950` | `#142A24` | Texto claro principal |

El dorado no se usa para texto pequeño sobre blanco ni como único indicador.

#### 3.2 Tokens semánticos — claro

| Token | Valor |
|---|---|
| `color-bg` | `#FFF9EC` |
| `color-surface` | `#FFFFFF` |
| `color-surface-subtle` | `#F5F3EB` |
| `color-text` | `#142A24` |
| `color-text-muted` | `#52665F` |
| `color-border` | `#C9D3CF` |
| `color-primary` | `#084C3B` |
| `color-on-primary` | `#FFFFFF` |
| `color-accent` | `#9A6500` |
| `color-focus` | `#246BCE` |
| `color-danger` | `#A62922` |
| `color-warning` | `#7A5600` |
| `color-success` | `#17633F` |

#### 3.3 Tokens semánticos — oscuro

| Token | Valor |
|---|---|
| `color-bg` | `#071E18` |
| `color-surface` | `#0D3027` |
| `color-surface-subtle` | `#153B31` |
| `color-text` | `#FFF7E5` |
| `color-text-muted` | `#C3D1CB` |
| `color-border` | `#45645A` |
| `color-primary` | `#F0BC3E` |
| `color-on-primary` | `#17230F` |
| `color-accent` | `#F0BC3E` |
| `color-focus` | `#80B7FF` |
| `color-danger` | `#FFB4AC` |
| `color-warning` | `#FFD67A` |
| `color-success` | `#8DDBB2` |

Todos los pares finales se verificarán con WCAG AA sobre su superficie real antes de implementar.

#### 3.4 Resultados de entrenamiento

| Resultado | Icono | Etiqueta | Color auxiliar |
|---|---|---|---|
| Incorrecta | `X` | Incorrecta | peligro |
| Correcta | marca de verificación | Correcta | éxito |

Los botones mantienen texto completo y orden estable. No usar rojo/amarillo/verde como única codificación.

### 4. Tipografía

#### 4.1 Familias

```css
--font-ui: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-brand: ui-serif, Georgia, "Times New Roman", serif;
--font-mono: ui-monospace, "SFMono-Regular", Consolas, monospace;
```

- `font-ui`: toda la interfaz y documentación dentro de la app.
- `font-brand`: palabra de marca en usos controlados; no en botones o párrafos.
- `font-mono`: diagnósticos, nunca para contenido reglamentario normal.

No se descargan fuentes externas.

#### 4.2 Escala

| Token | Tamaño | Peso | Uso |
|---|---:|---:|---|
| `display` | 32 px | 700 | Bienvenida, excepcional |
| `title-1` | 28 px | 700 | Título principal |
| `title-2` | 22 px | 650 | Sección importante |
| `title-3` | 18 px | 650 | Tarjeta o subsección |
| `body` | 16 px | 400 | Texto normal |
| `body-strong` | 16 px | 650 | Etiqueta destacada |
| `small` | 14 px | 400 | Metadatos |
| `caption` | 12 px | 500 | Solo información secundaria no esencial |

Altura de línea mínima: 1,4 en párrafos y 1,2 en títulos. No se usa texto esencial menor de 14 px.

### 5. Espaciado y geometría

Sistema base de 4 px:

```text
space-1  4
space-2  8
space-3  12
space-4  16
space-5  20
space-6  24
space-8  32
space-10 40
space-12 48
```

| Token | Valor |
|---|---:|
| Radio pequeño | 8 px |
| Radio control | 12 px |
| Radio tarjeta | 16 px |
| Radio píldora | 999 px |
| Borde normal | 1 px |
| Objetivo táctil mínimo | 44 × 44 px |
| Altura botón principal | 52 px |
| Margen móvil | 16 px |
| Máximo lectura | 720 px |

### 6. Elevación

Solo tres niveles:

- nivel 0: fondo;
- nivel 1: tarjeta o barra;
- nivel 2: hoja, menú o diálogo.

Se priorizan bordes sobre sombras. En modo oscuro, la elevación se expresa con superficie y borde, no con sombras negras fuertes.

### 7. Iconografía

- trazo simple de 2 px;
- esquinas redondeadas coherentes;
- tamaños 20, 24 y 28 px;
- iconos locales SVG;
- texto visible en acciones no universales;
- `aria-hidden` si el texto ya nombra la acción;
- nombre accesible si el control solo muestra icono;
- no usar huellas de perro como decoración repetitiva.

Conjunto mínimo: inicio, entrenar, señales, progreso, perro, ajustes, buscar, filtrar, volver, más, editar, archivar, borrar, copia, restaurar, información, offline, actualizar, pausa, continuar y deshacer.

### 8. Componentes reutilizables

#### 8.1 Botones

| Variante | Uso |
|---|---|
| Primario | Única acción principal |
| Secundario | Alternativa segura |
| Texto | Acción de baja prioridad |
| Peligro | Borrado confirmado |
| Resultado | Captura durante sesión |
| Icono | Solo acciones universales con etiqueta accesible |

Estados: normal, hover cuando exista, activo, foco visible, deshabilitado y ocupado.

Un botón ocupado conserva anchura y texto contextual. No se deshabilita sin explicar la causa.

#### 8.2 Campos

- etiqueta persistente encima;
- ayuda debajo si es necesaria;
- error junto al campo y resumen al enviar en formularios largos;
- no depender de placeholder;
- altura mínima 48 px;
- teclado y `autocomplete` adecuados;
- contador solo cerca del límite.

#### 8.3 Tarjeta de señal

Variantes compacta y detallada. Anatomía contractual:

- señal gráfica oficial obligatoria, sin redibujar;
- identidad;
- contexto;
- estado;
- motivo opcional;
- material especializado opcional;
- indicador de navegación.

La variante compacta reserva 88 × 68 px para la señal sobre fondo blanco. La variante detallada conserva la proporción original, muestra autoridad, documento y página, y mantiene fondo blanco también en modo oscuro. El texto alternativo sigue el patrón `Señal oficial {autoridad} {número}: {nombre}`.

#### 8.4 Insignia de estado

Texto + icono + superficie suave. No ocupa más atención que la acción primaria.

#### 8.5 Selector segmentado

Máximo tres opciones visibles. Para cuatro grados en pantalla estrecha usar selector desplegable o lista accesible, no desplazamiento horizontal oculto.

#### 8.6 Hoja inferior

- elecciones breves;
- título;
- cierre visible;
- altura ajustada al contenido;
- foco gestionado;
- alternativa de pantalla completa si aparece teclado o contenido largo.

#### 8.7 Banner

Solo para copia pendiente, actualización o problema de datos. Una acción y cierre cuando proceda. No apilar más de uno; prioridad: integridad > sesión > actualización > copia.

#### 8.8 Gráficos

- leyenda textual;
- patrones o etiquetas además de color;
- tabla accesible equivalente;
- sin animación esencial;
- cero truncado cuando represente cantidades;
- pocos datos implica lista, no gráfico.

### 9. Navegación

#### Barra inferior

- cuatro destinos;
- icono + texto;
- altura visual 64 px más `safe-area-inset-bottom`;
- activo con forma y texto, no solo color;
- sin botón flotante central.

#### Barra superior

- título o marca;
- atrás cuando la pantalla es hija;
- perro activo o acción contextual;
- máximo dos acciones visibles.

### 10. Animación

| Movimiento | Duración | Uso |
|---|---:|---|
| Estado de botón | 100 ms | Respuesta táctil |
| Cambio de contenido | 160 ms | Aparición suave |
| Hoja/modal | 200 ms | Entrada y salida |
| Progreso de estado | 240 ms | Solo tras guardar, no celebraciones largas |

Curva estándar: `cubic-bezier(0.2, 0, 0, 1)`.

Con `prefers-reduced-motion: reduce`:

- duración cercana a cero;
- sin desplazamientos amplios;
- sin parallax, rebotes ni contadores animados;
- la información final aparece inmediatamente.

### 11. Sonido y háptica

- sin sonido por defecto;
- vibración desactivada por defecto;
- nunca son el único feedback;
- una vibración corta puede confirmar un resultado en plataformas compatibles;
- no intentar emular soporte inexistente en iOS.

### 12. Lenguaje y tono

#### Principios

- directo;
- breve;
- concreto;
- respetuoso;
- sin culpabilizar;
- orientado a la siguiente acción.

#### Vocabulario preferido

| Evitar | Usar |
|---|---|
| Has fallado | Esta repetición no salió |
| Tu perro no sabe | Todavía está en progreso |
| Debes completar | Puedes terminar cuando lo necesites |
| Nivel bloqueado | Aún no se recomienda |
| Inteligencia artificial | Recomendación basada en tus entrenamientos |
| Texto oficial | Descripción reglamentaria / Fuente oficial |
| Guardado en la nube | Guardado en este dispositivo |

#### Botones

Verbo + objeto cuando haga falta: `Crear copia`, `Preparar sesión`, `Guardar perro`. Evitar `Aceptar` o `Sí` sin contexto.

### 13. Formatos

- fechas cercanas: “Hoy”, “Ayer”; detalle con `5 ago 2026`;
- horas según configuración regional;
- duración: `12 min`, no `00:12:03` salvo diagnóstico;
- conteos: números enteros;
- porcentajes acompañados de fracción;
- grados: `Debutante`, `Grado 1`, `Grado 2`, `Grado 3`;
- lados: `Izquierda`, `Derecha`, `No aplica`.

### 14. Accesibilidad visual

- WCAG 2.2 AA como mínimo;
- contraste 4,5:1 en texto normal y 3:1 en grande;
- foco con mínimo 2 px y contraste 3:1;
- zoom 200 %;
- reflow a 320 CSS px;
- no impedir zoom;
- áreas táctiles 44 px;
- estados no dependen de color;
- texto sobre imágenes evitado;
- modo alto contraste del sistema no debe ocultar controles.

### 15. Tokens CSS propuestos

```css
:root {
  color-scheme: light dark;
  --font-ui: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius-control: 0.75rem;
  --radius-card: 1rem;
  --tap-min: 2.75rem;
  --content-reading: 45rem;
}
```

Los colores se asignarán mediante tema y tokens semánticos; los componentes no usarán valores hexadecimales directos.

### 16. Criterios de aceptación

- [ ] La marca se denomina Rally O Trainer en todos los activos nuevos.
- [ ] El icono PWA funciona sin texto.
- [ ] Verde es la acción principal y dorado el acento.
- [ ] Todos los componentes usan tokens semánticos.
- [ ] La interfaz usa fuentes locales del sistema.
- [ ] Los objetivos táctiles cumplen 44 px.
- [ ] Correcta e Incorrecta se distinguen por icono, texto y color.
- [ ] Modos claro y oscuro conservan jerarquía y contraste.
- [ ] Movimiento reducido elimina animaciones no esenciales.
- [ ] El tono no culpa al usuario ni al perro.
- [ ] No se usan imágenes ni identidad visual oficial RSCE/FCI.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Paleta real del logotipo no coincide exactamente | Extraer y ajustar colores al preparar activos finales |
| Dorado falla contraste | Reservarlo a superficies, iconos grandes y texto oscuro validado |
| Marca detallada no escala | Símbolo simplificado e icono sin texto |
| Componentes propios aumentan trabajo | Conjunto pequeño, tokens y pruebas visuales |
| Estados de resultado parecen juicio emocional | Etiquetas descriptivas y tono neutral |

## Mejoras posibles

- Crear biblioteca visual documentada con Storybook si el número de componentes lo justifica.
- Producir activos adaptativos para iOS y Android.
- Validar paleta mediante simulaciones de daltonismo.
- Preparar tema de impresión para recorridos.
- Añadir ilustraciones de movimiento coherentes con la marca.

## Decisiones pendientes

| ID | Decisión | Momento límite |
|---|---|---|
| DP-16-001 | Redibujar o regenerar el logotipo completo con el nombre final | Antes de publicación alfa |
| DP-16-002 | Extraer paleta exacta del activo original y contrastarla con tokens propuestos | Implementación visual |
| DP-16-003 | Elegir conjunto final de iconos locales | Resuelta para PWA v1: símbolo vectorial y PNG generados localmente |
| DP-16-004 | Validar la variante de marca con el propietario | Antes de iconos PWA finales |
