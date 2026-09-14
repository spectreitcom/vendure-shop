FROM node:26-alpine

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/vendure/package.json apps/vendure/package.json
COPY apps/shop-frontend/package.json apps/shop-frontend/package.json
COPY packages packages

RUN npm install

COPY apps/shop-frontend apps/shop-frontend

WORKDIR /repo/apps/shop-frontend

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
