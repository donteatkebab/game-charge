# ---- build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm build

# ---- runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=builder /app ./
RUN rm -rf node_modules && pnpm install --prod --frozen-lockfile
EXPOSE 1337
CMD ["pnpm", "start"]
