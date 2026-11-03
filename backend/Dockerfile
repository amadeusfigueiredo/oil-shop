# syntax=docker/dockerfile:1
FROM node:24.19.0-slim AS dependencies
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    npm ci --omit=dev

FROM node:24.19.0-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3001
CMD [ "node", "start.js" ]
