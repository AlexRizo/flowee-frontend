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

    ...prefix('centro-de-asignaciones', [
      layout('routes/dashboard/assignment-center/_layout.tsx', [
        index('routes/dashboard/assignment-center/_index.tsx'),
      ]),
    ]),
    
    ...prefix('tableros', [
      route(':slug', 'routes/dashboard/boards/board.tsx'),
    ]),

    // ? Rutas para usuarios;
    route('usuarios', 'routes/dashboard/users/_index.tsx'),
    route('usuarios/:nickname', 'routes/dashboard/users/user.tsx'),

    ...prefix('solicitudes', [
      layout('routes/dashboard/tasks/layouts/_layout.tsx', [
        layout('routes/dashboard/tasks/layouts/task-preview-layout.tsx', [
          index('routes/dashboard/tasks/_index.tsx'),
        ]),
        
        layout('routes/dashboard/tasks/layouts/create-task-layout.tsx', [
          route('nueva-solicitud', 'routes/dashboard/tasks/create-task.tsx'),
          route('nueva-solicitud/digital', 'routes/dashboard/tasks/digital-task.tsx'),
          route('nueva-solicitud/impresa', 'routes/dashboard/tasks/print-task.tsx'),
          route('nueva-solicitud/ecommerce', 'routes/dashboard/tasks/ecommerce-task.tsx'),
          route('nueva-solicitud/especial', 'routes/dashboard/tasks/special-task.tsx'),
          route('solicitud-enviada', 'routes/dashboard/tasks/task-done.tsx'),
        ]),
      ]),
    ]),

    // ? Rutas para perfil;
    route('perfil', 'routes/dashboard/profile.tsx'),

    // ? Ruta para cerrar sesión;
    route('logout', 'routes/dashboard/logout.tsx'),
  ]),

] satisfies RouteConfig;
