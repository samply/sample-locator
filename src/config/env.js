(function (window) {
  window["env"] = window["env"] || {};

  window["env"]["features"] = {
    "stratifier": true,
    "stratifierMinimalNumberBiobanks": 1
  };

  // Environment variables
  window["env"]["externalServices"] = {
    "brokerUrl": "http://localhost:8080/broker",
    "sampleLocatorUrl": "http://localhost:8085",
    "negotiatorUrl": "https://negotiator.bbmri-eric.eu"
  };

  window["env"]["molgenisCredentials"] = {
    "molgenisUsername": "your-molgenis-username",
    "molgenisPassword": "your-molgenis-password"
  };

  window["env"]["mdrConfig"] = {
    "mdrRestUrl": "http://mdr.test.germanbiobanknode.de/v3/api/mdr",
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
      },
      {
        "nameOfEnum": "RELATIVE",
        "urn": "urn:mdr16:dataelementgroup:7:1"
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
        "unit": ""
      },
      {
        "urn": "urn:mdr16:dataelement:36:1",
        "placeholder": "e.g. 423461",
        "unit": ""
      },
      {
        "urn": "urn:mdr16:dataelement:42:1",
        "placeholder": "e.g. 423461",
        "unit": ""
      },



      {
        "urn": "urn:mdr16:dataelement:41:1",
        "placeholder": "e.g. FAMMEMB",
        "unit": ""
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
      "urn:mdr16:dataelement:13:1",

      "urn:mdr16:dataelement:38:1",
      "urn:mdr16:dataelement:39:1",
      "urn:mdr16:dataelement:40:1"

    ]
  };
})(this);
