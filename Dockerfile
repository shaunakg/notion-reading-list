FROM node:16.17.0-alpine3.16@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b
ARG DATABASE_ID
ARG NOTION_API_KEY
WORKDIR /app
COPY ["index.js", "modules.js", "package.json", "package-lock.json", "./"]
RUN npm install --location=global npm && npm install
EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]
