
FROM node:10 as builder

ENV NODE_ENV development

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN yarn

COPY . /home/node/app

ENV NODE_ENV production

RUN yarn ssr:build && \
  yarn --production && \
  yarn add @vue/cli-service && \
  yarn cache clean

#######################################################
FROM node:10-alpine

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 8080

COPY --from=builder /home/node/app /home/node/app

RUN chown -R node:node /home/node/app

USER node
WORKDIR /home/node/app

CMD ["./node_modules/.bin/vue-cli-service", "ssr:start"]
