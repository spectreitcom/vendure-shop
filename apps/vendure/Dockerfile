FROM node:26-alpine

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/vendure/package.json apps/vendure/package.json
COPY apps/shop-frontend/package.json apps/shop-frontend/package.json
COPY packages packages

RUN npm install

COPY apps/vendure apps/vendure

WORKDIR /repo/apps/vendure

EXPOSE 3000

CMD ["npm", "run", "dev"]
