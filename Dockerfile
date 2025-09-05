FROM docker.io/rust:1.88-alpine3.20 AS base-rust
RUN apk add upx musl-dev
RUN cargo install cargo-chef@0.1.72
WORKDIR /build

FROM docker.io/node:20.15.1-alpine3.20 AS base-node
RUN npm install -g pnpm
WORKDIR /build


FROM base-rust AS vingo-recipe

COPY vingo/ ./
RUN cargo chef prepare --recipe-path=recipe.json


FROM base-rust AS vingo-build

COPY --from=vingo-recipe /build/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path=recipe.json

COPY vingo/ ./
RUN cargo build --release

RUN upx --best --lzma target/release/vingo


FROM base-node AS vinvoor-build

WORKDIR /build

COPY vinvoor/package.json package.json
COPY vinvoor/pnpm-lock.yaml pnpm-lock.yaml
RUN pnpm i

COPY vinvoor/ ./
COPY vinvoor/production.env .env
RUN pnpm run build


FROM alpine:3.20 AS runner

WORKDIR /work
COPY --from=vingo-build /build/target/release/vingo vingo
COPY --from=vinvoor-build /build/dist/ public/

ENV DEVELOPMENT=FALSE
EXPOSE 4000
ENTRYPOINT ["./vingo"]
