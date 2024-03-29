(function (window) {
  window["env"] = window["env"] || {};

  window["env"]["features"] = {
    "stratifier": true,
    "stratifierMinimalNumberBiobanks": 1
  };

  window["env"]["branding"] = {
    "ui": "BBMRI",    // used for Logos,  'GBA' / 'BBMRI'
    "title": "BBMRI Locator",
    "favicon": "favicon_BBMRI.png",   // located in '..assets/img/'   GBA: 'favicon.ico' ,  BBMRI: 'favicon_BBMRI.png'
    "metaDescription": "The BBMRI Locator enables scientists to search for biosamples and related data across multiple academic biobanks.",
    "aboutUsLink": "https://www.bbmri-eric.eu/about/",  // GBA: '/about-us'  ,  BBMRI: 'https://www.bbmri-eric.eu/about/',
    "contactLink": "https://www.bbmri-eric.eu/contact/",  // :GBA: '/imprint'  ,  BBMRI: 'https://www.bbmri-eric.eu/contact/'
    "contactText": "Contact",   // GBA: 'Imprint'  ,  BBMRI: 'Contact'
    "privacyPolicyLink": "https://www.bbmri-eric.eu/privacy-notice/"   // :GBA: '/privacy'  ,  BBMRI: 'https://www.bbmri-eric.eu/privacy-notice/'
  };

  // Environment variables
  window["env"]["externalServices"] = {
    // "brokerUrl": "http://localhost:8097/share_broker_rest_war",
    // "brokerUrl": "http://localhost:8080/broker",
    // "brokerUrl": "https://samplelocator.bbmri.de/broker",
    "brokerUrl": "https://locator.bbmri-eric.eu/broker",
    "sampleLocatorUrl": "http://localhost:8085",
    "negotiatorUrl": "https://negotiator.bbmri-eric.eu",
    "terminologyServerUrl": "https://samplelocator.bbmri.de/icd10"
    // "terminologyServerUrl": "https://r4.ontoserver.csiro.au/fhir"
  };

  window["env"]["molgenisCredentials"] = {
    "molgenisUsername": "your-molgenis-username",
    "molgenisPassword": "your-molgenis-password"
  };

  window["env"]["mdrConfig"] =
    {
      "mdrRestUrl": "http://mdr.germanbiobanknode.de/v3/api/mdr",
      "mdrNamespace": "mdr16",
      "languageCode": "en",
      "dataElementGroups": [
      {
        "nameOfEnum": "DONOR",
        "urn": "urn:mdr16:dataelementgroup:5:1"
      },
      {
        "nameOfEnum": "SAMPLE",
        "urn": "urn:mdr16:dataelementgroup:3:1"
      },
      {
        "nameOfEnum": "EVENT",
        "urn": "urn:mdr16:dataelementgroup:6:1"
      }
    ],
    "dataElements": [
      {
        "urn": "urn:mdr16:dataelement:29:1",
        "placeholder": "",
        "unit": "kg"
      },
      {
        "urn": "urn:mdr16:dataelement:30:1",
        "placeholder": "",
        "unit": "cm"
      },
      {
        "urn": "urn:mdr16:dataelement:28:1",
        "placeholder": "",
        "unit": "years"
      },
      {
        "urn": "urn:mdr16:dataelement:14:1",
        "placeholder": "",
        "unit": "years"
      },
      {
        "urn": "urn:mdr16:dataelement:27:1",
        "placeholder": "e.g. C25.1",
        "unit": "",
        "valueSetUrl": "http://hl7.org/fhir/sid/icd-10-gm"
       //  "valueSetUrl": "http://hl7.org/fhir/ValueSet/condition-code"
      }
    ],

    "hiddenDataElements": [
      "urn:mdr16:dataelement:1:1",
      "urn:mdr16:dataelement:25:1",
      "urn:mdr16:dataelement:34:1",
      "urn:mdr16:dataelement:18:1",
      "urn:mdr16:dataelement:11:1",
      "urn:mdr16:dataelement:19:1",
      "urn:mdr16:dataelement:30:1",
      "urn:mdr16:dataelement:4:1",
      "urn:mdr16:dataelement:21:1",
      "urn:mdr16:dataelement:22:1",
      "urn:mdr16:dataelement:24:1",
      "urn:mdr16:dataelement:13:1"
    ]
  };
})(this);
