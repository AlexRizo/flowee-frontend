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
    
    ...prefix('tableros', [
      route(':slug', 'routes/dashboard/boards/board.tsx'),
    ]),

    // ? Rutas para usuarios;
    route('usuarios', 'routes/dashboard/users/_index.tsx'),
    route('usuarios/:nickname', 'routes/dashboard/users/user.tsx'),

    ...prefix('solicitudes', [
      index('./routes/dashboard/tasks/_index.tsx'),
      route('crear', './routes/dashboard/tasks/create-task.tsx'),
      route('crear/digital', './routes/dashboard/tasks/digital-task.tsx'),
      route('crear/impresa', './routes/dashboard/tasks/print-task.tsx'),
      route('crear/ecommerce', './routes/dashboard/tasks/ecommerce-task.tsx'),
      route('crear/especial', './routes/dashboard/tasks/special-task.tsx'),
    ]),

    // ? Rutas para perfil;
    route('perfil', 'routes/dashboard/profile.tsx'),

    // ? Ruta para cerrar sesión;
    route('logout', 'routes/dashboard/logout.tsx'),
  ]),

] satisfies RouteConfig;
