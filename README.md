# Sistema Core — frontend

Requiere una versión de Node.js compatible con Angular 21. Ejecutar `npm install` y `npm start`; abrir la dirección local indicada por Angular CLI. Para compilar, ejecutar `npm run build`.

La aplicación inicia con `useMock: true` en `src/environments/environment.ts`, por lo que se puede recorrer sin backend. Al conectar el backend, cambiar el flag a `false` y configurar `apiBaseUrl`. La sesión de demostración permite alternar entre operador y supervisor; no reemplaza la autenticación ni la autorización del servidor.

`src/app/features/` contiene los módulos funcionales, `core/` contiene sesión, layout y helpers HTTP, y `shared/` reúne componentes y tipos comunes. Los colores y estilos globales están en `src/styles.scss`.
