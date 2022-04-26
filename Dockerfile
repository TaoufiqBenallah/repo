FROM docker.artifacts.rbi.tech/merlin-docker-base/merlin-docker-base-node:12.RELEASE

ENV GROUP=rbi-group \
    USER=rbi-user

USER root

WORKDIR /usr/app

COPY ./client/ ./client

COPY ["server/package.json", "server/package-lock.json", "server/tsconfig.build.json", "server/tsconfig.json", "./"]
COPY ./server/src ./src

RUN mkdir ./public

RUN cd client/ \
    && npm install \
    && npm run buildDocker

RUN rm -r ./client  \
    && npm install --only=production \
    && npm run build \
    && groupadd -g 1001 ${GROUP} \
    && useradd -u 1001 ${USER} -g ${GROUP} \
    && chown -R ${USER}:${GROUP} /usr/app/

USER ${USER}:${GROUP}

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]
