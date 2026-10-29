# Sistema Core — frontend

## Iniciar

Se requiere Node.js compatible con Angular 21. Ejecuta `npm install` y `npm start`. Abre la dirección local que muestre Angular CLI. Para comprobar la compilación, ejecuta `npm run build`.

La aplicación arranca sin backend porque `src/environments/environment.ts` tiene `useMock: true`. La pantalla de inicio de sesión admite los usuarios de ejemplo `operador` y `supervisor` definidos en `src/app/features/autenticacion/data-access/autenticacion.mock.ts`; consulta ese archivo para sus contraseñas de prueba. Cinco intentos fallidos consecutivos bloquean al usuario de ejemplo. Para conectar el backend, cambia `useMock` a `false` y configura `apiBaseUrl` con la base de la API, sin incluir credenciales.

## Estructura

`src/app/core/` contiene sesión, guards, HTTP y layout; `src/app/features/autenticacion/` contiene Inicio de sesión y `src/app/features/inicio/` la Pantalla de inicio. `src/app/shared/` reúne piezas reutilizables. Las rutas se registran en `src/app/app.routes.ts` y la navegación en `src/app/core/layout/side-nav.ts`.
