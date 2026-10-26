# Sistema Core — Frontend

Requiere una versión de Node.js compatible con Angular 21.

```sh
npm install
npm start
```

Abra la dirección local que muestra Angular CLI. `npm run build` genera la versión de distribución.

La aplicación inicia con datos de ejemplo y no necesita un backend. La configuración está en `src/environments/environment.ts`: `useMock: true` activa los mocks y `apiBaseUrl` indica la URL base que usarán los servicios HTTP al conectar el backend. No incluya credenciales en ese archivo.

`src/app/features/` contiene los módulos funcionales y sus rutas, páginas, modelos y acceso a datos; `src/app/core/` contiene la sesión y el layout; `src/app/shared/` contiene piezas reutilizables. El enrutador carga cada módulo de forma diferida.
