const axios = require("axios");

exports.checkMedicationInRxNorm = async (medicationName) => {
  try {
    const response = await axios.get(
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(
        medicationName
      )}`
    );
    const rxcui = response.data.idGroup?.rxnormId[0];
    return rxcui || null;
  } catch (error) {}
};
