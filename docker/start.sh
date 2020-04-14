#!/usr/bin/env bash

envsubst  < ./config/env.template.js > ./config/env.js
envsubst  < ./config/auth.clientConfiguration.template.json > ./config/auth.clientConfiguration.json

echo 'Start NGINX in foreground (non-daemon-mode)'
nginx -g 'daemon off;'
