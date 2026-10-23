# Sistema Core — Frontend

Requiere una versión de Node.js compatible con Angular 21.

```sh
npm install
npm start
```

Abrir la dirección local que indique Angular CLI. `npm run build` genera la aplicación en `dist/`.

La aplicación inicia con `useMock: true` en `src/environments/environment.ts`, por lo que puede utilizarse sin backend. Para conectar la API, configurar `apiBaseUrl` y cambiar `useMock` a `false`. No incluir credenciales en ese archivo.

`src/app/features/` contiene las funcionalidades; `core/` agrupa sesión, HTTP y layout; `shared/` contiene piezas reutilizables. El selector de rol del encabezado es solo una simulación de interfaz: las autorizaciones reales deben verificarse también en el backend.
