# Build backend
FROM rust:1.81-alpine3.20 as build_backend

RUN apk add upx musl-dev

WORKDIR /

COPY vingo/Cargo.* .

COPY vingo/migration migration

COPY vingo/src src

RUN cargo build --release

RUN upx --best --lzma target/release/vingo

# Build frontend
FROM node:20.15.1-alpine3.20 as build_frontend

WORKDIR /

COPY vinvoor/package.json package.json

COPY vinvoor/yarn.lock yarn.lock

RUN yarn install

COPY vinvoor/ .

COPY vinvoor/production.env .env

RUN yarn run build

# End container
FROM alpine:3.20

WORKDIR /

COPY --from=build_backend target/release/vingo .
COPY --from=build_frontend /dist public

ENV DEVELOPMENT=FALSE

EXPOSE 4000

ENTRYPOINT ["./vingo"]
