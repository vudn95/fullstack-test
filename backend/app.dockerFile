# stage: buid
FROM public.ecr.aws/docker/library/node:18.19-alpine3.18 as build
WORKDIR /usr/src/app
RUN apk add --no-cache bash
COPY ./ /usr/src/app
RUN rm -rf node_modules
RUN yarn
RUN yarn build

# stage: run
FROM public.ecr.aws/docker/library/node:18.19-alpine3.18 as run
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=build /usr/src/app/.env /usr/src/app/.env

RUN apk update && apk add openssl
EXPOSE 3000
CMD yarn prod
