# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3 && npm i -g pnpm@7

# Prep pnpm cache
FROM base as deps-prefetch

WORKDIR /myapp

ADD pnpm-lock.yaml .npmrc ./
ENV NODE_ENV development
ENV CYPRESS_INSTALL_BINARY 0
RUN pnpm fetch

# Install dev deps to node_modules
FROM deps-prefetch as dev-deps

WORKDIR /myapp

ADD package.json ./
ENV NODE_ENV development
RUN pnpm install --offline

# Prep a trimmed production node_modules folder
FROM deps-prefetch as prod-deps

WORKDIR /myapp
ADD package.json ./
COPY --from=dev-deps /myapp/node_modules /myapp/node_modules
RUN pnpm prune --prod

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=dev-deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN pnpm prisma generate
RUN pnpm build

# Finally, build the production image with minimal footprint
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=prod-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/prisma/schema.prisma /myapp/build/
COPY --from=build /myapp/app/generated/client/*.so.node /myapp/build/

ENTRYPOINT [ "./start.sh" ]
