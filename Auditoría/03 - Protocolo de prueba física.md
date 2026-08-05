# Protocolo de prueba física

## Objetivo

Verificar lo que no puede demostrar una compilación: instalación, tacto con una mano, persistencia real, modo avión, actualización y recuperación. Ejecutar primero en iPhone 16 Pro y después en al menos un Android del club.

## Preparación

- URL HTTPS publicada en GitHub Pages (`https://jquiigl.github.io/rally-o-trainer/`);
- un perro de prueba y datos no críticos;
- cronómetro externo;
- una copia JSON conocida;
- acceso a activar modo avión y borrar datos del sitio.

## Caso A — Primera instalación

1. Abrir la URL en el navegador recomendado.
2. Medir hasta que Inicio sea utilizable.
3. Instalar en pantalla de inicio.
4. Cerrar navegador y abrir desde el icono.

Resultado esperado:

- [ ] Nombre e icono correctos.
- [ ] Se abre sin barra normal de navegador.
- [ ] Safe areas no tapan cabecera ni navegación.
- [ ] Primera interacción útil en menos de dos segundos con red normal.

## Caso B — Flujo principal con una mano

1. Crear perro.
2. Inicio → Preparar sesión → Empezar.
3. Registrar diez intentos alternando los tres resultados.
4. Deshacer el último.
5. Finalizar antes de tiempo, indicar motivo y ayuda.

Resultado esperado:

- [ ] No se necesita zoom ni giro del dispositivo.
- [ ] Los tres botones se alcanzan y distinguen.
- [ ] No hay pulsaciones dobles accidentales.
- [ ] El resultado aparece en Progreso.

## Caso C — Interrupción

1. Empezar una sesión.
2. Bloquear el teléfono durante un minuto.
3. Cerrar la PWA y volver a abrirla.

Resultado esperado:

- [ ] Inicio ofrece **Continuar sesión**.
- [ ] El temporizador refleja tiempo real transcurrido.
- [ ] No permite cambiar al otro perro durante la sesión.
- [ ] No se pierde ningún intento confirmado.

## Caso D — Modo avión

1. Abrir una vez con red y cerrar.
2. Activar modo avión.
3. Abrir desde el icono.
4. Consultar una señal, entrenar, cerrar, revisar progreso, crear pista y hacer examen.

Resultado esperado:

- [ ] Todas las acciones funcionan.
- [ ] No aparece pantalla en blanco.
- [ ] Al reiniciar la PWA, los datos siguen presentes.

## Caso E — Copia y recuperación

1. Exportar copia.
2. Confirmar que el archivo puede guardarse fuera de la PWA.
3. Borrar todo con las dos confirmaciones.
4. Restaurar la copia.

Resultado esperado:

- [ ] Perros, sesiones, resultados, pistas y ajustes reaparecen.
- [ ] Un archivo manipulado o ajeno se rechaza sin borrar datos.

## Caso F — Accesibilidad visual

1. Probar claro, oscuro y sistema.
2. Aumentar el texto del sistema.
3. Activar reducción de movimiento.
4. Usar VoiceOver o TalkBack en el flujo de sesión.

Resultado esperado:

- [ ] No se corta información esencial.
- [ ] El foco sigue un orden comprensible.
- [ ] Resultado y estado no dependen solo del color.
- [ ] Los botones tienen nombres claros.

## Registro

| Campo | Valor |
|---|---|
| Dispositivo |  |
| Sistema y versión |  |
| Navegador y versión |  |
| Fecha |  |
| Versión de Rally O Trainer |  |
| Resultado | Apto / No apto |
| Incidencias |  |

## Riesgos

- El simulador no reproduce totalmente almacenamiento, instalación o gestión de memoria.
- Borrar la PWA antes de exportar puede perder datos de prueba.
- Una sola ejecución no representa uso con sol, guantes, lluvia o perro en movimiento.

## Mejoras posibles

- Grabar tiempos y errores de pulsación de forma manual durante el piloto.
- Repetir con texto al 200 % y baja batería.
- Probar una actualización con service worker en espera.

## Decisiones pendientes

- Modelo Android de referencia.
- Alojamiento HTTPS usado en la prueba.
- Umbral final de rendimiento en red lenta.
