FROM node:lts-alpine3.18 AS build-web

COPY client-web client-web

WORKDIR client-web

RUN npm ci

RUN npm run build

FROM node:lts-alpine3.18

ARG PB_VERSION=0.16.10

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

COPY --from=build-web client-web/dist /pb/pb_public

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]