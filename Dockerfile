# build
FROM node:17-alpine3.14 AS builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

COPY --chown=node:node . .

RUN yarn install
RUN yarn run build

#
FROM node:17-alpine3.14

ENV NODE_ENV=production
ENV HOME=/home/node/app

USER node
RUN mkdir -p $HOME
WORKDIR $HOME

COPY --from=builder /home/node/package.json .
COPY --from=builder /home/node/.production.env .
COPY --from=builder /home/node/tsconfig.build.json .
COPY --from=builder /home/node/node_modules/ ./node_modules
COPY --from=builder /home/node/dist/ ./dist

EXPOSE 3000

CMD ["yarn", "run", "start"]