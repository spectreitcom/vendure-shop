FROM node:26-alpine

WORKDIR /repo/apps/vendure

COPY apps/vendure/package.json ./

RUN npm install -g npm@11.19.0 && npm install

COPY apps/vendure .

EXPOSE 3000

CMD ["npm", "run", "dev"]
