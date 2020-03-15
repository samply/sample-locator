# SampleLocator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8085/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Run ([Docker](#docker))
#### Docker

    docker network create gba
    
    ng build --prod
    
    docker run \
        --rm \
        --name=searchbroker-ui \
        --network=gba \
        -p 8084:8080 \
        -e SEARCHBROKER_URL='https://broker.germanbiobanknode.de' \
        -e SAMPLELOCATOR_URL='https://samplelocator.bbmri.de' \
        -e NEGOTIATOR_URL='https://negotiator.bbmri-eric.eu' \
        -e AUTH_HOST='https://login.bbmri-eric.eu' \
        -e AUTH_CLIENT_ID='88ad6e4f-af9b-430a-8884-394e29cd10c1' \
        -e MDR_API_URL='https://mdr.germanbiobanknode.de/v3/api/mdr' \
        -e MDR_NAMESPACE='mdr16' \
        -e MDR_LANGUAGE='en' \
        -e MDR_MAPPING='[{"nameOfEnum": "DONOR","urn": "urn:mdr16:dataelementgroup:5:1"},{"nameOfEnum": "SAMPLE","urn": "urn:mdr16:dataelementgroup:3:1"},{"nameOfEnum": "EVENT", "urn": "urn:mdr16:dataelementgroup:6:1"}]' \
        -e MDR_FIELD_PROPERTIES='[{"urn": "urn:mdr16:dataelement:29:1","placeholder": "","unit": "kg"},{"urn": "urn:mdr16:dataelement:30:1","placeholder": "","unit": "cm"},{"urn": "urn:mdr16:dataelement:28:1","placeholder": "","unit": "years"},{"urn": "urn:mdr16:dataelement:14:1","placeholder": "","unit": "years"},{"urn": "urn:mdr16:dataelement:27:1","placeholder": "e.g. C25.1","unit": ""}]' \
        -e MDR_HIDDEN='["urn:mdr16:dataelement:1:1","urn:mdr16:dataelement:25:1","urn:mdr16:dataelement:34:1","urn:mdr16:dataelement:18:1","urn:mdr16:dataelement:11:1","urn:mdr16:dataelement:19:1","urn:mdr16:dataelement:30:1","urn:mdr16:dataelement:4:1","urn:mdr16:dataelement:21:1","urn:mdr16:dataelement:22:1","urn:mdr16:dataelement:24:1","urn:mdr16:dataelement:13:1"]' \
        -e MOLGENIS_USERNAME='your_molgenis_username' \
        -e MOLGENIS_PASSWORD='your_molgenis_password' \
        searchbroker-ui:latest

