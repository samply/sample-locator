(function (window) {
  window["env"] = window["env"] || {};

  window["env"]["features"] = {
    "stratifier": ${FEATURE_STRATIFIER:-false}
  };

  // Environment variables
  window["env"]["externalServices"] = {
    "brokerUrl": "${SEARCHBROKER_URL}",
    "sampleLocatorUrl": "${SAMPLELOCATOR_URL}",
    "negotiatorUrl": "${NEGOTIATOR_URL}"
  };

  window["env"]["molgenisCredentials"] = {
    "molgenisUsername": "${MOLGENIS_USERNAME}",
    "molgenisPassword": "${MOLGENIS_PASSWORD}"
  };

  window["env"]["mdrConfig"] = {
    "mdrRestUrl": "${MDR_API_URL}",
    "mdrNamespace": "${MDR_NAMESPACE}",
    "languageCode": "${MDR_LANGUAGE}",
    "dataElementGroups": ${MDR_MAPPING},
    "dataElements": ${MDR_FIELD_PROPERTIES},
    "hiddenDataElements": ${MDR_HIDDEN}
  };
})(this);
