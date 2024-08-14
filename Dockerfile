# Build backend
FROM golang:1.22.1-alpine3.19 as build_backend

RUN apk add upx alpine-sdk

WORKDIR /

COPY vingo/go.sum  go.sum

COPY vingo/go.mod go.mod

RUN go mod download

COPY vingo/main.go .

COPY vingo/database database

COPY vingo/handlers handlers

RUN CGO_ENABLED=1 go build -ldflags "-s -w" -v -tags musl vingo/.

RUN upx --best --lzma vingo



# Build frontend
FROM node:20.15.1-alpine3.20 as build_frontend

WORKDIR /

COPY vinvoor/package.json package.json

COPY vinvoor/yarn.lock yarn.lock

RUN yarn install

COPY vinvoor/ .

RUN yarn run build



# End container
FROM alpine:3.19

WORKDIR /

COPY --from=build_backend vingo .
COPY --from=build_frontend /dist public

ENV DEVELOPMENT=false

EXPOSE 4000

ENTRYPOINT ["./vingo"]
