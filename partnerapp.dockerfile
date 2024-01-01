FROM node:16.15.1 as partner-app-build
WORKDIR /partner-app-frontend

COPY ./partner-app-frontend/package.json ./
RUN npm install
COPY ./partner-app-frontend/ ./

RUN npm run build
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=partner-app-build /partner-app-frontend/build /usr/share/nginx/html