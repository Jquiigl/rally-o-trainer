# Publicación de Rally O Trainer en GitHub Pages

## 1. Decisión adoptada

Rally O Trainer está publicado en GitHub Pages desde el repositorio público `Jquiigl/rally-o-trainer`. Esta opción mantiene el coste de infraestructura en cero, proporciona HTTPS y permite desplegar una aplicación estática sin crear un servidor ni una base de datos remota.

URL pública: [https://jquiigl.github.io/rally-o-trainer/](https://jquiigl.github.io/rally-o-trainer/)

GitHub solo aloja el código y la distribución compilada. Los datos de perros y entrenamientos permanecen en IndexedDB dentro de cada navegador.

## 2. Preparación de la cuenta

1. Crear una cuenta en [GitHub](https://github.com/).
2. Verificar el correo electrónico y activar autenticación en dos pasos.
3. Crear un repositorio **público** y vacío llamado `rally-o-trainer`.
4. No añadir desde la web README, licencia ni `.gitignore`, porque el proyecto local ya contiene sus propios archivos.

El nombre puede cambiarse, pero hacerlo también cambia la ruta pública. Para reducir errores se recomienda conservar `rally-o-trainer`.

## 3. Primera publicación

Desde la raíz del proyecto:

```bash
pnpm check
git remote add origin https://github.com/Jquiigl/rally-o-trainer.git
git push -u origin main
```

Después, en GitHub:

1. abrir **Settings**;
2. entrar en **Pages**;
3. elegir **GitHub Actions** en **Build and deployment → Source**;
4. abrir **Actions** y comprobar que `Deploy GitHub Pages` termina correctamente.

La URL prevista es:

```text
https://jquiigl.github.io/rally-o-trainer/
```

La primera publicación puede tardar unos minutos. No se necesita dominio propio.

## 4. Publicaciones posteriores

Cada envío a la rama `main`:

1. instala las dependencias desde el archivo de bloqueo;
2. valida fuentes y contenido;
3. ejecuta comprobación de tipos y pruebas;
4. construye y valida la PWA;
5. publica `dist/` solo si todo lo anterior es correcto.

También puede iniciarse manualmente desde **Actions → Deploy GitHub Pages → Run workflow**.

## 5. Verificación obligatoria tras publicar

- Abrir la URL pública y recorrer las cuatro áreas principales.
- Recargar dentro de una ruta con `#` y confirmar que no aparece un error 404.
- Instalar la PWA en el iPhone 16 Pro.
- Abrir una vez con red; activar modo avión y completar una sesión.
- Volver a conectar y comprobar una actualización sin una sesión activa.
- Confirmar que los datos creados en un dispositivo no aparecen en otro: es el comportamiento local esperado.
- Exportar una copia, borrar datos de una instalación de prueba y restaurarla.

Antes del piloto con el club se repetirá instalación, modo avión y restauración en al menos un Android físico.

## 6. Recuperación

Si el despliegue falla, GitHub Pages conserva la última versión publicada correctamente. Debe corregirse el error y volver a enviar el cambio; no se publicará manualmente una carpeta incompleta.

Si la web carga pero la PWA parece antigua:

1. finalizar cualquier sesión activa;
2. aceptar el aviso de actualización;
3. cerrar y volver a abrir la aplicación instalada.

Una nueva publicación no borra IndexedDB. Aun así, antes de cambios de esquema debe verificarse la migración y conservar una copia exportada.

## Riesgos

- GitHub Pages no permite configurar todas las cabeceras HTTP de seguridad.
- Un repositorio público expone código y documentación; nunca debe contener secretos ni datos personales.
- Cambiar el nombre del repositorio cambia la URL y puede exigir reinstalar la PWA.
- Las pruebas automáticas no reproducen por completo Safari iOS ni todos los Android.

## Mejoras posibles

- Añadir un dominio propio solo si el proyecto llega a necesitar una dirección estable independiente de GitHub.
- Incorporar una vista previa separada si varias personas empiezan a desarrollar simultáneamente.
- Automatizar pruebas de accesibilidad y rendimiento después de estabilizar el piloto.

## Decisiones pendientes

- Instalación, modo avión y restauración comprobados en dispositivos físicos.
- Dispositivo Android físico de referencia.
- Momento de apertura del piloto a las cinco personas del club.
