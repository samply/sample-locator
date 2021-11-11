(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["features"] = {
    "stratifier": ${FEATURE_STRATIFIER},
    "stratifierMinimalNumberBiobanks": ${FEATURE_STRATIFIER_MIN_NO_BIOBANKS}
  };

  window["env"]["branding"] = {
    "ui": "${BRANDING_UI}",
    "title": "${BRANDING_TITLE}",
    "favicon": "${FAVICON_PATH}",
    "metaDescription": "${META_DESCRIPTION}",
    "aboutUsLink": "${ABOUTUS_PATH}",
    "contactLink": "${CONTACT_PATH}",
    "contactText": "${CONTACT_TEXT}",
    "privacyPolicyLink": "${PRIVACY_PATH}"
  };

  window["env"]["externalServices"] = {
    "brokerUrl": "${SEARCHBROKER_URL}",
    "sampleLocatorUrl": "${SAMPLELOCATOR_URL}",
    "negotiatorUrl": "${NEGOTIATOR_URL}",
    "terminologyServerUrl": "${TERMINOLOGY_SERVER_URL}"
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
