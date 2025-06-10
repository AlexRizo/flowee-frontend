import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  ...prefix('auth', [
    layout('routes/auth/_layout.tsx', [
      index('routes/auth/_index.tsx'),
    ])
  ]),

  layout('routes/dashboard/_layout.tsx', [
    index('routes/dashboard/_index.tsx'),
    route('autoasignaciones', 'routes/dashboard/autoasignaciones.tsx'),
    route('centro-de-asignaciones', 'routes/dashboard/centro-de-asignaciones.tsx'),
    route('tablero/:slug', 'routes/dashboard/board.tsx'),
    route('usuarios', 'routes/dashboard/users.tsx'),

    // ? Ruta para cerrar sesión;
    route('logout', 'routes/dashboard/logout.tsx'),
  ]),

] satisfies RouteConfig;
