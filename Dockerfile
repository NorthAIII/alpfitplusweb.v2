# syntax=docker/dockerfile:1

##########  base  ##########
FROM node:24-bookworm-slim AS base
ENV PNPM_HOME=/pnpm NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

##########  deps  ##########
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

##########  dev  ##########
# Hot-reload gelistirme konteyneri. Kaynak kod bind-mount ile gelir.
# NOT: NODE_ENV burada SABITLENMEZ. Sabitlenince ayni konteynerde calisan
# "npm run build" de development modunda koser ve /_global-error prerender'i
# React baglami bulamayip cokerdi (olculdu).
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "dev"]

##########  build  ##########
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

##########  runner (uretim)  ##########
FROM base AS runner
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
