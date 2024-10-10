import axios from "axios";

interface RxNormResponse {
  idGroup?: {
    rxnormId?: string[];
  };
}

// Function to check medication in RxNorm API
export const checkMedicationInRxNorm = async (
  medicationName: string
): Promise<string | null> => {
  try {
    const response = await axios.get<RxNormResponse>(
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(
        medicationName
      )}`
    );

    const rxcui = response.data.idGroup?.rxnormId
      ? response.data.idGroup.rxnormId[0]
      : null;
    return rxcui;
  } catch (error) {
    console.error("Error fetching medication from RxNorm:", error);
    return null; // Return null in case of an error
  }
};
