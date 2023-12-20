FROM public.ecr.aws/docker/library/node:18.19-alpine3.18
WORKDIR /usr/src/app
RUN apk add --no-cache bash
COPY ./ /usr/src/app
RUN rm -rf node_modules
RUN yarn
EXPOSE 3000
CMD yarn start
