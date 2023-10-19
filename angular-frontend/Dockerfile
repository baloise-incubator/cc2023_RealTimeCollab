FROM nginx:stable

COPY dist/angular-frontend /usr/share/nginx/html
RUN mkdir /etc/nginx/templates
COPY nginx.conf  /etc/nginx/templates/default.conf.template

EXPOSE 80