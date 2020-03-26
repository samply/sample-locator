#!/usr/bin/env bash

echo 'Started: start.sh'

set -e

sed -i "s%{searchbroker-url}%${SEARCHBROKER_URL}%"          /usr/share/nginx/html/config/ExternalServices.json
sed -i "s%{samplelocator-url}%${SAMPLELOCATOR_URL}%"        /usr/share/nginx/html/config/ExternalServices.json
sed -i "s%{negotiator-url}%${NEGOTIATOR_URL}%"              /usr/share/nginx/html/config/ExternalServices.json

sed -i "s%{mdr-api-url}%${MDR_API_URL}%"                    /usr/share/nginx/html/config//MdrConfig.json
sed -i "s%{mdr-namespace}%${MDR_NAMESPACE}%"                /usr/share/nginx/html/config//MdrConfig.json
sed -i "s%{mdr-language}%${MDR_LANGUAGE}%"                  /usr/share/nginx/html/config//MdrConfig.json
sed -i "s%{mdr-mapping}%${MDR_MAPPING}%"                    /usr/share/nginx/html/config//MdrConfig.json
sed -i "s%{mdr-hidden}%${MDR_HIDDEN}%"                      /usr/share/nginx/html/config//MdrConfig.json
sed -i "s%{mdr-field-properties}%${MDR_FIELD_PROPERTIES}%"  /usr/share/nginx/html/config//MdrConfig.json

sed -i "s%{molgenis-username}%${MOLGENIS_USERNAME}%"        /usr/share/nginx/html/config/MolgenisCredentials.json
sed -i "s%{molgenis-password}%${MOLGENIS_PASSWORD}%"        /usr/share/nginx/html/config/MolgenisCredentials.json

sed -i "s%{samplelocator-url}%${SAMPLELOCATOR_URL}%"        /usr/share/nginx/html/config/auth.clientConfiguration.json
sed -i "s%{authorization-url}%${AUTH_HOST}%"                /usr/share/nginx/html/config/auth.clientConfiguration.json
sed -i "s%{authorization-client-id}%${AUTH_CLIENT_ID}%"     /usr/share/nginx/html/config/auth.clientConfiguration.json

nginx -g 'daemon off;'
echo 'Started NGINX in foreground (non-daemon-mode)'
