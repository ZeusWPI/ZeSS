FROM golang:1.22.1-alpine3.19 as build

RUN apk add upx alpine-sdk

WORKDIR /

COPY go.sum .

COPY go.mod .

RUN go mod download

COPY main.go .

COPY database database

COPY handlers handlers

RUN CGO_ENABLED=1 go build -ldflags "-s -w" -v -tags musl

RUN upx --best --lzma vingo

FROM alpine:3.19

WORKDIR /

COPY --from=build vingo .

ENTRYPOINT ["./vingo"]
