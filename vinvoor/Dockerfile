FROM node:22.2.0-alpine3.19 as build-stage

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY ./ .

RUN yarn run build


FROM nginx:alpine-slim as production-stage

EXPOSE 3000

RUN mkdir /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /app
