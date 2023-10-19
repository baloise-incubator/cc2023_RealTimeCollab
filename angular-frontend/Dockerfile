FROM nginxinc/nginx-unprivileged:stable

COPY dist/angular-frontend /usr/share/nginx/html
RUN mkdir /etc/nginx/templates
COPY backend.nginx.conf.template /etc/nginx/templates/backend.conf.template
COPY nginx.conf /etc/nginx/conf.d/websocket.conf

EXPOSE 80