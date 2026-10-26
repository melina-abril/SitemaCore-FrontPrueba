# Sistema Core — frontend

Aplicación Angular 21 standalone para la operación de clientes, cuentas, movimientos y cierre diario.

## Inicio

```sh
npm install
npm start
```

Abrir la dirección local indicada por Angular CLI. Para compilar: `npm run build`.

`src/environments/environment.ts` define `apiBaseUrl` y `useMock`. El modo mock está activado inicialmente, por lo que las pantallas funcionan sin backend. Para conectar el backend, configurar la URL base de la API y cambiar `useMock` a `false`.

`src/app/features/` contiene los módulos funcionales con rutas lazy, páginas, modelos y acceso a datos. `src/app/core/` contiene sesión, HTTP y layout; `src/app/shared/` contiene elementos reutilizables. El acceso a cierre diario se reserva al rol supervisor.
