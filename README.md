# SampleLocator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8085/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Docker

Run `docker build .` to build a Docker image. It's not necessary to run `ng build --prod` before, because a build container is used.

## Run ([Docker](#docker))
#### Docker

    docker build -t sample-locator .

    docker run 
        --rm 
        --name=sample-locator
        -p 8085:80 
        -e SEARCHBROKER_URL="http://localhost:8080" 
        -e SAMPLELOCATOR_URL="http://localhost:8085" 
        -e NEGOTIATOR_URL="https://negotiator.bbmri-eric.eu" 
        -e TERMINOLOGY_SERVER_URL="https://r4.ontoserver.csiro.au/fhir"
        -e AUTH_HOST="https://login.bbmri-eric.eu" 
        -e AUTH_CLIENT_ID="88ad6e4f-af9b-430a-8884-394e29cd10c1" 
        -e MDR_API_URL="http://mdr.test.germanbiobanknode.de/v3/api/mdr" 
        -e MDR_NAMESPACE="mdr16" 
        -e MDR_LANGUAGE="en" 
        -e MDR_MAPPING="[{\"nameOfEnum\": \"DONOR\",\"urn\": \"urn:mdr16:dataelementgroup:5:1\"},{\"nameOfEnum\": \"SAMPLE\",\"urn\": \"urn:mdr16:dataelementgroup:3:1\"},{\"nameOfEnum\": \"EVENT\", \"urn\": \"urn:mdr16:dataelementgroup:6:1\"}]" 
        -e MDR_FIELD_PROPERTIES="[{\"urn\": \"urn:mdr16:dataelement:29:1\",\"placeholder\": \"\",\"unit\": \"kg\"},{\"urn\": \"urn:mdr16:dataelement:30:1\",\"placeholder\": \"\",\"unit\": \"cm\"},{\"urn\": \"urn:mdr16:dataelement:28:1\",\"placeholder\": \"\",\"unit\": \"years\"},{\"urn\": \"urn:mdr16:dataelement:14:1\",\"placeholder\": \"\",\"unit\": \"years\"},{\"urn\": \"urn:mdr16:dataelement:27:1\",\"placeholder\": \"e.g. C25.1\",\"unit\": \"\", \"valueSetUrl\": \"http://hl7.org/fhir/ValueSet/condition-code\"}]" 
        -e MDR_HIDDEN="[\"urn:mdr16:dataelement:1:1\",\"urn:mdr16:dataelement:25:1\",\"urn:mdr16:dataelement:34:1\",\"urn:mdr16:dataelement:18:1\",\"urn:mdr16:dataelement:11:1\",\"urn:mdr16:dataelement:19:1\",\"urn:mdr16:dataelement:30:1\",\"urn:mdr16:dataelement:4:1\",\"urn:mdr16:dataelement:21:1\",\"urn:mdr16:dataelement:22:1\",\"urn:mdr16:dataelement:24:1\",\"urn:mdr16:dataelement:13:1\"]" 
        -e MOLGENIS_USERNAME="your_molgenis_username" 
        -e MOLGENIS_PASSWORD="your_molgenis_password" 
        sample-locator:latest

| Envionment variable                | Meaning                                                                                       | Default |
|------------------------------------|-----------------------------------------------------------------------------------------------|---------|
| SAMPLELOCATOR_URL                  | URL of the Sample Locator                                                                     |
| SEARCHBROKER_URL                   | URL of the Searchbroker API (Backend)                                                         |
| NEGOTIATOR_URL                     | URL of the Negotiator                                                                         |
| TERMINOLOGY_SERVER_URL             | URL of the terminology server                                                                 |
| AUTH_HOST                          | URL of the OpenID Connect provider                                                            |
| AUTH_CLIENT_ID                     | Client-ID of the OpenID Connect Provider                                                      |
| MOLGENIS_USERNAME                  | Username of Molgenis                                                                          |
| MOLGENIS_PASSWORD                  | Password of Molgenis                                                                          |
| MDR_API_URL                        | URL of the MDR                                                                                |
| MDR_NAMESPACE                      | Namespace of the MDR                                                                          |
| MDR_LANGUAGE                       | Language code for the MDR                                                                     |
| MDR_MAPPING                        | MDR entities and their URNs                                                                   | []      |
| MDR_FIELD_PROPERTIES               | Specification of placeholder and units for fields                                             | []      |
| MDR_HIDDEN                         | Fields to be ignored                                                                          | []      |
| FEATURE_STRATIFIER                 | Feature toggle for stratifications                                                            | false   |
| FEATURE_STRATIFIER_MIN_NO_BIOBANKS | Minimal number of connectors which must send stratifications in order to show stratifications | 3       |
 | SILENT_RENEW                       | Toggle to enable silent renew of the auth token                                               |

 ## License
        
 Copyright 2020 The Samply Development Community
        
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
        
 http://www.apache.org/licenses/LICENSE-2.0
        
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

