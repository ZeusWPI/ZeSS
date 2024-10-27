# Build backend
FROM rust:1.81-alpine3.20 as build_backend

RUN apk add upx musl-dev

WORKDIR /

COPY vingo/Cargo.* ./

COPY vingo/migration migration/

COPY vingo/src src/

RUN cargo build --release

RUN upx --best --lzma target/release/vingo

# Build frontend
FROM node:20.15.1-alpine3.20 as build_frontend

WORKDIR /

RUN npm install -g pnpm

COPY vinvoor/package.json package.json

COPY vinvoor/pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm install

COPY vinvoor/ ./

COPY vinvoor/production.env .env

RUN pnpm run build

# End container
FROM alpine:3.20

WORKDIR /

COPY --from=build_backend target/release/vingo .
COPY --from=build_frontend /dist public

ENV DEVELOPMENT=FALSE

EXPOSE 4000

ENTRYPOINT ["./vingo"]
