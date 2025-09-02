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

# 1) Instala deps (para reusar la caché)
FROM node:20-alpine AS deps
RUN npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

# 2) Build de producción de React Router 7 (modo framework)
FROM node:20-alpine AS build
RUN npm i -g pnpm
WORKDIR /app
COPY . .
# 🔴 IMPORTANTE: declarar y exportar VITE_* antes del build
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

COPY --from=deps /app/node_modules ./node_modules
# ➜ Debe ejecutar el build de RR7 (no sólo vite)
RUN pnpm run build

# 3) Runner liviano que sirve el build
FROM node:20-alpine AS runner
RUN npm i -g pnpm
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Copiamos deps de prod y el build ✅
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/build ./build
EXPOSE 3000
# Arranca el server bundler generado por RR7
CMD ["pnpm","exec","react-router-serve","./build/server/index.js","--port","3000"]