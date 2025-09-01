# FROM node:20-alpine AS development-dependencies-env
# RUN npm install -g pnpm
# COPY . /app
# WORKDIR /app
# RUN pnpm install

# FROM node:20-alpine AS production-dependencies-env
# RUN npm install -g pnpm
# COPY ./package.json pnpm-lock.yaml /app/
# WORKDIR /app
# RUN pnpm install --prod

# FROM node:20-alpine AS build-env
# RUN npm install -g pnpm
# COPY . /app/
# COPY --from=development-dependencies-env /app/node_modules /app/node_modules
# WORKDIR /app
# RUN pnpm run build

# FROM node:20-alpine
# RUN npm install -g pnpm
# COPY ./package.json pnpm-lock.yaml /app/
# COPY --from=production-dependencies-env /app/node_modules /app/node_modules
# COPY --from=build-env /app/build /app/build
# WORKDIR /app
# CMD ["pnpm", "run", "start"]

# -------------------------
# 1) Base de construcción
# -------------------------
  FROM node:20-alpine AS deps
  ENV PNPM_HOME=/root/.local/share/pnpm
  ENV PATH=$PNPM_HOME:$PATH
  RUN corepack enable && corepack prepare pnpm@latest --activate
  WORKDIR /app
  # Copiamos solo manifiestos para cachear mejor la instalación
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  
  # -------------------------
  # 2) Build
  # -------------------------
  FROM node:20-alpine AS build
  ENV PNPM_HOME=/root/.local/share/pnpm
  ENV PATH=$PNPM_HOME:$PATH
  RUN corepack enable && corepack prepare pnpm@latest --activate
  WORKDIR /app
  COPY . .
  # Reusamos node_modules de la etapa "deps" (mejor cache)
  COPY --from=deps /app/node_modules ./node_modules
  # RR7 framework genera /build (server + client)
  RUN pnpm run build
  
  # -------------------------
  # 3) Runtime (ligero)
  # -------------------------
  FROM node:20-alpine AS runner
  # Paquetes útiles si hay deps nativas (opcional, pero ayuda)
  RUN apk add --no-cache libc6-compat
  ENV NODE_ENV=production
  ENV PNPM_HOME=/root/.local/share/pnpm
  ENV PATH=$PNPM_HOME:$PATH
  RUN corepack enable && corepack prepare pnpm@latest --activate
  WORKDIR /app
  
  # Sólo dependencias de producción
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --prod --frozen-lockfile
  
  # Copiamos el resultado del build
  COPY --from=build /app/build ./build
  
  # Railway inyecta PORT. RR7/Node deben escuchar 0.0.0.0
  ENV HOST=0.0.0.0
  ENV PORT=3000
  EXPOSE 3000
  
  # Si en package.json tienes: "start": "react-router-serve"
  CMD ["pnpm", "run", "start"]