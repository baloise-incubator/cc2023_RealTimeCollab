FROM nginx:stable

COPY /dist/src/app/dist/my-docker-angular-app /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80