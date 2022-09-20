FROM nginx:alpine

### Install bash
RUN apk update
RUN apk upgrade
RUN apk add bash

### Configuration of NGINX
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

WORKDIR /usr/share/nginx/html

### Copy subfolder of dist as ng buils --prod creates an extra subfolder
COPY ./dist/sample-locator .
COPY docker/config                  ./config

ADD docker/start.sh                 /samply/

RUN chmod +x                        /samply/start.sh
## add permissions for 1001 user
RUN chown -R 1001:1001 /samply /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && chmod -R 755 /samply
RUN touch /var/run/nginx.pid && \
        chown -R 1001:1001 /var/run/nginx.pid

RUN chown -R 1001:1001 ./config
USER 1001

ENV FEATURE_STRATIFIER=false
ENV FEATURE_STRATIFIER_MIN_NO_BIOBANKS=3
ENV SILENT_RENEW=true

ENV MDR_MAPPING=[] MDR_FIELD_PROPERTIES=[] MDR_HIDDEN=[]

CMD ["/samply/start.sh"]

