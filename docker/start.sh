#!/usr/bin/env bash

# Substitute the env vars from the docker-compose.yml files into the
# template and overwite the stock env.js file.
# Ideally, this would be conditional on the existence of the
# variables, but right now, if they are not defined, then
# env.js gets filled with emptiness and you get a blank GUI.
#envsubst  < ./config/env.template.js > ./config/env.js

envsubst  < ./config/auth.clientConfiguration.template.json > ./config/auth.clientConfiguration.json

echo 'Start NGINX in foreground (non-daemon-mode)'
exec nginx -g 'daemon off;'
