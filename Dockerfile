# syntax=docker/dockerfile:1

# The Node version comes from .nvmrc via a build arg so the image, CI and the
# local machine cannot drift apart.
ARG NODE_VERSION=22

# ---------------------------------------------------------------------------
# deps — install once, cached until yarn.lock changes
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# ---------------------------------------------------------------------------
# builder — produces the standalone bundle
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the bundle at build time, not read at
# startup. The site URL therefore has to be a build argument: an image built
# with the wrong one has the wrong URL baked into every feed entry, sitemap
# entry and social preview, and no runtime setting will fix it.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Articles are checked out into content/ before the build; the build fails
# loudly if they are missing.
RUN yarn build

# ---------------------------------------------------------------------------
# runner — only what is needed to serve
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# The standalone output is a self-contained server with only the modules it
# actually traced — no node_modules copy needed.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets are deliberately NOT part of standalone and have to be copied
# separately. Forgetting this yields a site that serves HTML with no CSS.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# No shell wrapper, so the process gets PID 1 and receives SIGTERM directly.
CMD ["node", "server.js"]
