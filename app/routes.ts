import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  ...prefix("auth", [
    layout('routes/auth/_layout.tsx', [
      index("routes/auth/_index.tsx"),
    ])
  ]),

  layout("routes/dashboard/_layout.tsx", [
    index("routes/dashboard/_index.tsx"),
  ]),

] satisfies RouteConfig;
