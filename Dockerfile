FROM node as build

COPY src /build/src
COPY *.json /build/
COPY *.js /build/
COPY browserslist /build/

WORKDIR /build
RUN npm install
RUN node_modules/.bin/ng build --prod

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
COPY --from=build /build/dist/sample-locator .
COPY docker/config                  ./config

ADD docker/start.sh                 /samply/
RUN chmod +x                        /samply/start.sh

ENV FEATURE_STRATIFIER=false
ENV FEATURE_STRATIFIER_MIN_NO_BIOBANKS=3

ENV MDR_MAPPING=[] MDR_FIELD_PROPERTIES=[] MDR_HIDDEN=[]

CMD ["/samply/start.sh"]

