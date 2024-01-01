FROM node:16.15.1 as customer-app-build

WORKDIR /customer-app-frontend

COPY ./customer-app-frontend/package.json ./

RUN npm install

COPY ./customer-app-frontend ./

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=customer-app-build /customer-app-frontend/build /usr/share/nginx/html

