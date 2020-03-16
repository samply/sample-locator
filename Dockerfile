FROM nginx:alpine

### Install bash
RUN apk update
RUN apk upgrade
RUN apk add bash

### Configuration of NGINX
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

WORKDIR /usr/share/nginx/html

### Copy subfolder of dist as ng buils --prod creates an extra subfolder
COPY dist/sample-locator .

ADD docker/start.sh                 /samply/
RUN chmod +x                        /samply/start.sh
CMD ["/samply/start.sh"]

