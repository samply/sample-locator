#!/usr/bin/env bash

set -e

sed -i "s%{searchbroker-url}%${SEARCHBROKER_URL}%"          /dist/sample-locator/assets/config/ExternalServices.json
sed -i "s%{samplelocator-url}%${SAMPLELOCATOR_URL}%"        /dist/sample-locator/assets/config//ExternalServices.xml
sed -i "s%{negotiator-url}%${NEGOTIATOR_URL}%"              /dist/sample-locator/assets/config//ExternalServices.xml

sed -i "s%{mdr-api-url}%${MDR_API_URL}%"                    /dist/sample-locator/assets/config//MdrConfig.json
sed -i "s%{mdr-namespace}%${MDR_NAMESPACE}%"                /dist/sample-locator/assets/config//MdrConfig.json
sed -i "s%{mdr-language}%${MDR_LANGUAGE}%"                  /dist/sample-locator/assets/config//MdrConfig.json
sed -i "s%{mdr-mapping}%${MDR_MAPPING}%"                    /dist/sample-locator/assets/config//MdrConfig.json
sed -i "s%{mdr-hidden}%${MDR_HIDDEN}%"                      /dist/sample-locator/assets/config//MdrConfig.json
sed -i "s%{mdr-field-properties}%${MDR_FIELD_PROPERTIES}%"  /dist/sample-locator/assets/config//MdrConfig.json

sed -i "s%{molgenis-username}%${MOLGENIS_USERNAME}%"        /dist/sample-locator/assets/config/MolgenisCredentials.json
sed -i "s%{molgenis-password}%${MOLGENIS_PASSWORD}%"        /dist/sample-locator/assets/config/MolgenisCredentials.json

sed -i "s%{samplelocator-url}%${SAMPLELOCATOR_URL}%"        /dist/sample-locator/assets/config/auth.clientConfiguration.json
sed -i "s%{authorization-url}%${AUTH_HOST}%"                /dist/sample-locator/assets/config/auth.clientConfiguration.json
sed -i "s%{authorization-client-id}%${AUTH_CLIENT_ID}%"     /dist/sample-locator/assets/config/auth.clientConfiguration.json

