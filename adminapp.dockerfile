FROM node:16.15.1 as admin-app-build

WORKDIR /admin-app-frontend

COPY ./admin-app-frontend/package.json ./

RUN npm install

COPY ./admin-app-frontend ./

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=admin-app-build /admin-app-frontend/build /usr/share/nginx/html

