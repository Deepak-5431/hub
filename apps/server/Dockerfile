# File: apps/server/Dockerfile

# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm fetch
RUN pnpm install -r --offline

# ---- Build Stage ----
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm
RUN pnpm build

# ---- Production Stage ----
FROM base as production
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main"]