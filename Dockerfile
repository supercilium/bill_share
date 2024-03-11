FROM nginx:latest
COPY ./bill-share.conf /etc/nginx/conf.d/default.conf
COPY ./build/ /usr/share/nginx/html