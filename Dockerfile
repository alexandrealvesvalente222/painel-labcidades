FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV SERVE_STATIC=1
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server

# Railway keeps a stuck startCommand of `SERVE_STATIC=1 node server/index.mjs`
# and runs it without a shell, so the first token is treated as the binary.
# Provide that binary name so the deploy can start.
RUN printf '%s\n' '#!/bin/sh' 'export SERVE_STATIC=1' 'cd /app' 'exec node server/index.mjs' > /usr/local/bin/SERVE_STATIC=1 \
  && chmod +x /usr/local/bin/SERVE_STATIC=1

EXPOSE 8787
CMD ["node", "server/index.mjs"]
