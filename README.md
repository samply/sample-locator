# SampleLocator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8085/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Docker

    docker build -t sample-locator .

## Run ([Docker](#docker))
#### Docker

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
| SILENT_RENEW                       | Toggle to enable silent renew of the auth token                                               | true    |

## License
        
 Copyright 2020 The Samply Development Community
        
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
        
 http://www.apache.org/licenses/LICENSE-2.0
        
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Customization

### Logos

You can replace existing logos with the logos relevant to your organization. To do this, you will need to add the logo files, modify some source code, and build the Docker image locally.

#### Adding files

You should have the logos of your organisation available as image files. PNG, JPEG or SVG formats are acceptable. 

Place the files in the directory:

        src/assets/img

For example, let's suppose you want to set up a Sample Locator for the Frankfurt university clinic, within the digital health care center. Then you might want the clinic's logo in the Sample Locator header and the center's logo in the footer.

So let's put the relevant files into the image directory:

        curl https://www.kgu.de/typo3conf/ext/kgu_theme/Resources/Public/Images/ukf_logo.svg>src/assets/img/ukf_logo.svg
        curl https://www.kgu.de/fileadmin/_processed_/5/d/csm_UCDHC_Logo_f1edfcde2d.jpg > src/assets/img/csm_UCDHC_Logo_f1edfcde2d.jpg

(These are just examples, and may not actually do anything).

#### Modifying sources

Now you have obtained the relevant logos and placed them somewhere that the Sample Locator knows about, but you still need to tell it which is header and which is footer.

To set the header, edit:

        src/app/component/header/header.component.html

Search for "GBA". Modify the HTML so that it looks like this:

        <div *ngIf="featureService.brandingUI() === 'GBA'" class="logo-main col-md-5">
          <a routerLink="/" title="www.kgu.de">
            <!--suppress HtmlUnknownTarget -->
            <img src="assets/img/ukf_logo.svg" alt="UKF-LOGO" class="gba-logo"/>
          </a>
        </div>

This will swap the original BBMRI logo with the logo for the university clinic. Write out the file and quit the editor.

For the footer, edit:

        src/app/component/footer/footer.component.html

Search for "DKFZ" and modify the HTML to look like this:

        <a href="https://www.kgu.de/ueber-uns/university-center-for-digital-healthcare-ucdhc" title="UCDHC" target="_blank">
          <img src="assets/img/csm_UCDHC_Logo_f1edfcde2d.jpg" alt="university-center-for-digital-healthcare" class="dkfz-logo"/>
        </a>

This will swap the original DKFZ logo with the logo for the digital health center. Write out the file and quit the editor.

#### Build local Docker image

See the "Build" section above for instructions on re-building the Docker image.

If you are running the Sample Locator from the [sample-locator-deployment repository](https://github.com/samply/sample-locator-deployment), you will need to modify the docker-compose.yml
file, where you should replace the searchbroker-ui image with the "sample-locator" image that you just created.
Then restart.

### Color scheme

The master file for changing the color scheme of the Sample Locator is in:

        src/_variables.scss

Changing the values here will change the colors throughout all pages of
the Sample Locator.

For example, if you would like to use brown tones rather than the standard
Sample Locator blue tones, you could change the contents of the file to
look like this:

        $background-light: #F6F1F0;
        $background-gray-light: #ABB2C5;
        $background-gray: #8B9EAC;
        $background-dark: #492B17;
        $background-dark-semi: #A5968C; // opacity =  50%
        
        $color-version: #D5FCC5;
        $color-gray: #8D9CAC;
        $color-medium: #95876F;
        $color-dark: #574730;
        $color-gold: #48A9F1;
        
        $link-indicator: #48A9F1;

These are variables that are used in other SCSS files in the GUI.

The hexedecimal numbers after the hash symbols encode colors as RGB values
like this:

        #rrggbb

