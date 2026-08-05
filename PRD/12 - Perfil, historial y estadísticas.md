# PRD — Capítulo 12: Perfil, historial y estadísticas

| Campo | Valor |
|---|---|
| Producto | Rally O Trainer |
| Estado | Especificación funcional |
| Fecha | 5 de agosto de 2026 |
| Dependencias | Capítulos 07, 10 y 11 |
| Próximo capítulo | Constructor de pistas y modo examen |

---

## Análisis previo

### Hipótesis revisadas

| Hipótesis | Problema | Resolución |
|---|---|---|
| Un perfil deportivo necesita muchos datos | Fecha, peso, foto o sexo no aportan al planificador v1 | Solo nombre y raza; estado derivado aparte |
| Más gráficos producen más conocimiento | En móvil pueden ocultar la acción siguiente | Resúmenes pequeños con acceso al detalle |
| Registrar competiciones ayuda a medir progreso | Está fuera del objetivo de entrenamiento | No registrar resultados competitivos |
| Un porcentaje global representa avance | Mezcla grados, lados y estados | Contadores por estado, grado y lado |
| El historial debe permitir editar todo | Complica trazabilidad | Detalle inmutable; eliminación completa confirmada |

### Debilidades detectadas

- Cinco personas pueden usar la app, pero los datos no deben mezclarse por cuentas inexistentes.
- Varios perros necesitan progreso completamente independiente.
- Estadísticas con pocos datos pueden resultar engañosas.
- Una mejora aparente puede deberse a registrar de forma diferente.
- Archivar y borrar pueden confundirse.

### Mejoras propuestas

1. Perfil mínimo y acciones separadas.
2. Inicio estadístico orientado a “qué necesita atención”.
3. Resultados absolutos antes que porcentajes decorativos.
4. Gráficos solo con suficiente evidencia.
5. Historial como fuente explicable del progreso.

---

## Versión definitiva

### 1. Perfil del perro

#### 1.1 Datos

| Campo | Obligatorio | Regla |
|---|:---:|---|
| Nombre | Sí | 1–60 caracteres |
| Raza | Sí | Texto libre, 1–100 caracteres; admite “mestizo” |

No se solicitan foto, sexo, fecha de nacimiento, microchip, salud, club, guía, grado oficial ni resultados.

#### 1.2 Resumen derivado

La ficha puede mostrar:

- próxima recomendación;
- última sesión;
- señales aprendidas;
- señales consolidadas;
- señales que necesitan repaso;
- grado recomendado, siempre como cálculo explicable.

Nada de esto es editable desde el perfil.

### 2. Varios perros

- el perro activo aparece en Inicio;
- cambiarlo requiere como máximo dos pulsaciones;
- cada sesión exige perro explícito;
- preferencias de ubicación e inventario pueden ser por perro;
- no se comparte progreso;
- señales y reglamentos sí son contenido común;
- crear otro perro no modifica recomendaciones del anterior.

### 3. Ciclo de vida

#### Editar

Permite cambiar nombre y raza sin afectar historial.

#### Archivar

- acción secundaria;
- reversible;
- conserva sesiones y progreso;
- oculta el perro de selectores normales;
- no puede dejar una sesión activa sin acceso.

#### Borrar definitivamente

- acción separada en zona de peligro;
- doble confirmación;
- enumera sesiones y registros afectados;
- ofrece crear copia antes;
- elimina perro, contexto, sesiones, bloques, registros y proyecciones;
- no elimina contenido reglamentario;
- no se puede deshacer salvo restaurando una copia anterior.

### 4. Historial

La pantalla responde:

> ¿Qué entrené y qué registré realmente?

Orden descendente por fecha. Cada fila muestra:

- fecha y hora;
- perro;
- señal o resumen de bloques;
- lado;
- duración;
- conteos de resultados;
- finalización anticipada, si ocurrió.

Filtros iniciales:

- perro;
- periodo: 7 días, 30 días, todo;
- señal;
- sesiones finalizadas antes.

### 5. Detalle de sesión

Incluye:

- contexto aceptado;
- versión del planificador;
- ubicación y objetivo;
- tiempos;
- bloques ordenados;
- revisión exacta de cada señal;
- resultados individuales o agregado sin mezclarlos;
- ayuda predominante;
- valoración general y nota;
- motivo de finalización;
- efecto calculado sobre progreso.

Acciones:

- repetir señal en una nueva sesión;
- abrir ficha de señal;
- eliminar sesión completa;
- exportar en el futuro.

### 6. Estadísticas principales

Orden de utilidad:

1. **Necesitan repaso.** Cantidad y acceso directo.
2. **En progreso.** Señales trabajadas pero no aprendidas.
3. **Aprendidas.** Cumplen 7/10.
4. **Consolidadas.** Cumplen mantenimiento.
5. **Actividad reciente.** Sesiones y tiempo, sin metas obligatorias.

### 7. Desglose por grado

| Métrica | Cálculo |
|---|---|
| Señales disponibles | Asignaciones vigentes del grado, sin inicio/final |
| Sin practicar | Sin evidencia comparable |
| En progreso | Estado correspondiente |
| Aprendidas | Estado `learned` o superior, sin repaso activo |
| Consolidadas | Estado `consolidated` |
| Necesitan repaso | Estado `needs-review` |

Una señal compartida cuenta dentro de cada grado para cobertura, pero una vista global de ejercicios distintos la cuenta una sola vez.

### 8. Lados

Para señales bilaterales:

- progreso izquierda;
- progreso derecha;
- diferencia de autonomía en puntos porcentuales solo si cada lado tiene al menos 10 evidencias;
- lado limitante;
- acceso a práctica del lado débil.

No se calculará “equilibrio” con menos evidencia suficiente.

### 9. Tendencias

Se permiten tres visualizaciones pequeñas:

| Visualización | Condición | Finalidad |
|---|---|---|
| Resultados por semana | ≥3 sesiones | Ver continuidad y mezcla de autonomía/ayuda/error |
| Evolución de una señal | ≥20 evidencias | Ver tendencia temporal |
| Distribución de estados | Siempre, salvo cero señales | Entender cobertura del grado |

No se usan tablas de clasificación, rachas punitivas, comparaciones entre perros ni puntuaciones sociales.

### 10. Cálculos

#### Tasa autónoma

```text
autonomousRate = autonomous / totalComparable
```

Siempre muestra numerador y denominador. No se muestra si `totalComparable = 0`.

#### Actividad

```text
activeMinutes = sum(session.activeDuration)
```

No se usa para evaluar calidad ni se fija una meta diaria.

#### Tendencia

Comparación descriptiva entre dos ventanas cronológicas equivalentes; solo se muestra si ambas tienen al menos 10 evidencias. Términos: `mejora`, `estable`, `requiere atención`, acompañados de datos.

### 11. Estados vacíos

| Estado | Mensaje y acción |
|---|---|
| Sin perros | “Añade un perro para guardar progreso” + `Añadir perro` |
| Perro sin sesiones | “Todavía no hay entrenamientos” + `Preparar primera sesión` |
| Sin repaso pendiente | “No hay repasos vencidos” + `Ver recomendación` |
| Pocos datos para tendencia | Mostrar conteos, no gráfico falso |
| Perro archivado | Aviso y `Reactivar` |

### 12. Privacidad

- todos los cálculos se realizan localmente;
- no se generan perfiles publicitarios;
- no se envían nombres o razas;
- una exportación informa qué incluye;
- capturas y compartición dependen del usuario;
- el modo de prueba no crea usuarios remotos.

### 13. Criterios de aceptación

- [ ] Crear un perro solo exige nombre y raza.
- [ ] El progreso no se edita desde el perfil.
- [ ] Cambiar perro no mezcla resultados.
- [ ] Archivar es reversible.
- [ ] Borrar exige doble confirmación y explica el alcance.
- [ ] El historial reproduce los hechos registrados.
- [ ] Una sesión eliminada deja de influir en progreso.
- [ ] No se registran competiciones.
- [ ] No se muestra un gráfico con evidencia insuficiente.
- [ ] Cada porcentaje incluye conteos comprensibles.
- [ ] Las estadísticas conducen a una acción útil.
- [ ] Todo funciona offline.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Estadísticas generan falsa precisión | Umbrales mínimos, conteos y explicaciones |
| Borrado accidental | Archivar por defecto, doble confirmación y copia |
| Grado recomendado se confunde con grado oficial | Etiqueta “recomendado para entrenar” y explicación |
| Demasiados gráficos | Límite de tres y prioridad a listas accionables |
| Comparación injusta entre perros | No ofrecer comparaciones |

## Mejoras posibles

- Exportación CSV de sesiones como vista derivada.
- Anotaciones privadas por periodo.
- Resumen mensual generado localmente.
- Comparación consigo mismo en periodos equivalentes.
- Widgets de acceso rápido si la PWA y plataforma lo permiten.

## Decisiones pendientes

| ID | Decisión | Momento límite |
|---|---|---|
| DP-12-001 | Autorizar edición posterior de la nota de sesión | Wireframes de detalle |
| DP-12-002 | Umbral exacto para considerar tendencia estable | Plan de pruebas estadísticas |
| DP-12-003 | Mostrar “grado recomendado” en MVP o posponerlo | Pruebas con principiantes |
