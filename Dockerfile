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

# 1) Dependencias
FROM node:20-alpine AS deps
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2) Build
FROM node:20-alpine AS build
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build \
 && echo "=== LISTANDO BUILD ===" \
 && ls -la build \
 && ls -la build/server || true

# 3) Runtime
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
# Copiamos TODO el build (client + server)
COPY --from=build /app/build ./build
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm","run","start"]