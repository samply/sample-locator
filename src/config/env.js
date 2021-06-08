(function (window) {
  window["env"] = window["env"] || {};

  window["env"]["features"] = {
    "stratifier": true,
    "stratifierMinimalNumberBiobanks": 1
  };

  // GBA || BBMRI
  window["env"]["branding"] = {
    "ui": "BBMRI"
  };

  // Environment variables
  window["env"]["externalServices"] = {
    "brokerUrl": "http://localhost:8080/broker",
    "sampleLocatorUrl": "http://localhost:8085",
    "negotiatorUrl": "https://negotiator.bbmri-eric.eu",
    "terminologyServerUrl": "https://samplelocator.bbmri.de/icd10"
    // "terminologyServerUrl": "https://r4.ontoserver.csiro.au/fhir"
  };

  window["env"]["molgenisCredentials"] = {
    "molgenisUsername": "your-molgenis-username",
    "molgenisPassword": "your-molgenis-password"
  };

  window["env"]["mdrConfigGBN"] =
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
  }
  window["env"]["mdrConfigCCDG"] =
      {
        "mdrRestUrl": "https://mdr.ccp-it.dktk.dkfz.de/v3/api/mdr",
        "mdrNamespace": "mdr16",
        "languageCode": "en",
        "dataElementGroups": [
          {
            "nameOfEnum": "Histopathology",
            "urn": "urn:ccdg:dataelementgroup:15:29"
          },
          {
            "nameOfEnum": "Pharmacotherapy",
            "urn": "urn:ccdg:dataelementgroup:11:8"
          },
          {
            "nameOfEnum": "Diagnostic exam",
            "urn": "urn:ccdg:dataelementgroup:7:10"
          },
          {
            "nameOfEnum": "Molecular markers",
            "urn": "urn:ccdg:dataelementgroup:6:13"
          },
          {
            "nameOfEnum": "Patient data",
            "urn": "urn:ccdg:dataelementgroup:1:8"
          },
          {
            "nameOfEnum": "Radiation therapy",
            "urn": "urn:ccdg:dataelementgroup:9:4"
          },
          {
            "nameOfEnum": "Response to therapy",
            "urn": "urn:ccdg:dataelementgroup:8:2"
          },
          {
            "nameOfEnum": "Sample",
            "urn": "urn:ccdg:dataelementgroup:16:8"
          },
          {
            "nameOfEnum": "Surgery",
            "urn": "urn:ccdg:dataelementgroup:3:9"
          },
          {
            "nameOfEnum": "Targeted therapy",
            "urn": "urn:ccdg:dataelementgroup:10:2"
          },
          {
            "nameOfEnum": "Vital status and survival information",
            "urn": "urn:ccdg:dataelementgroup:2:3"
          }
        ],
        "dataElements": [

        ],

        "hiddenDataElements": [
          "urn:ccdg:dataelement:82:3",
          "urn:ccdg:dataelement:16:3",
          "urn:ccdg:dataelement:2:2"
        ]
      }

})(this);
