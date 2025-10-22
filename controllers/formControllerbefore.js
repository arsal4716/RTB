
// before it's working fine when no api add for jornaya 
const Form = require("../models/Form");
const { appendFormDataToSheet } = require("../Helper/googleSheet");
const { google } = require("googleapis");
const keys = require("../sheet.json");
const axios = require("axios");
const fieldConfig = require("./fieldConfig");
const stateNameToCode = require("./stateNameToCode");
const {
  ringbaId: serverRingbaIds,
  baseRingbaUrl,
} = require("../api/ringbaUrls");
const { successResponse, errorResponse } = require("../utils/response");
const auth = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);
const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "10wDKwHfS5ytpOxSPIr89PG0J1hRoKQ7S_3Qvjk-Pqlk";
const TAB_NAME = "Database";

const fieldMap = {
  phone: "CID",
  zipcode: "ZipCode",
  exposeCallerId: "exposeCallerId",
  agentName: "agentname",
  fname: "firstname",
  lname: "lastname",
  email: "email",
  city: "city",
  state: "state",
  address: "address",
  dob: "dob",
  Age: "Age",
};

const createForm = async (req, res) => {
  try {
    const formData = req.body;
    const {
      phone,
      zipcode,
      campaign,
      publisher,
      ringbaId: clientRingbaId,
    } = formData;

    // === STEP 0: Basic Validation ===
    if (!phone) {
      return errorResponse(res, "Phone number is required");
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const phoneWith1 = cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;

    // === STEP 1: Check Google Sheet for Duplicates ===
    let isDuplicateInSheet = false;

    try {
      const sheetRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${TAB_NAME}!A:A`,
      });

      const sheetNumbers = sheetRes.data.values?.flat() || [];
      isDuplicateInSheet = sheetNumbers.includes(phoneWith1);
    } catch (sheetErr) {
      console.error("Google Sheet Error:", sheetErr.message);
    }

    if (isDuplicateInSheet) {
      return errorResponse(
        res,
        "This phone number already exists in our internal DB.",
        { duplicateSource: "GoogleSheet" },
        400
      );
    }
    try {
      const healthURL = `https://hcs.tldcrm.com/api/public/dialer/ready/${phoneWith1}?qui=27053&adg=true`;
      const healthRes = await axios.get(healthURL);

      if (healthRes.data?.ready === 0) {
        return errorResponse(
          res,
          "Duplicate in SCRUB campaign.",
          { duplicateSource: "HealthConnect" },
          400
        );
      }
    } catch (err) {
      console.error("HealthConnect API Error:", err.message);
    }

    // === STEP 3: Check for ZIP code ===
    if (!zipcode) {
      return errorResponse(res, "ZIP Code is required after duplicate check");
    }

    // === STEP 4: Prepare Ringba Request ===
    const stateFullName = formData.state;
    const stateAbbr = stateNameToCode[stateFullName];
    formData.state = stateAbbr;

    const correctRingbaId =
      clientRingbaId || serverRingbaIds[publisher]?.[campaign];
    if (!correctRingbaId) {
      return errorResponse(res, "Ringba ID not found for this campaign.");
    }

    const fullRingbaUrl = `${baseRingbaUrl}${correctRingbaId}`;
    const campaignFields =
      fieldConfig[publisher]?.[campaign] ||
      fieldConfig[publisher]?.["AnyCampaign"] ||
      [];

    formData.exposeCallerId = formData.exposeCallerId || "yes";
    const queryParams = new URLSearchParams();

    campaignFields.forEach((field) => {
      const paramName = fieldMap[field];
      if (paramName && formData[field] !== undefined) {
        let value = formData[field];
        if (paramName === "CID" && typeof value === "string") {
          value = value.replace(/\D/g, "");
          if (value.length === 10) value = `+1${value}`;
          else if (value.length === 11 && value.startsWith("1"))
            value = `+${value}`;
        }
        queryParams.append(paramName, value);
      }
    });

    const fullUrlWithQuery = `${fullRingbaUrl}?${queryParams.toString()}`;
    const ringbaResponse = await axios.get(fullUrlWithQuery);
    const ringbaData = ringbaResponse.data;

    // === STEP 5: Check Ringba Agent Response ===
    if (!ringbaData.phoneNumber) {
      return errorResponse(res, "No agents Available.", {
        ringbaResponse: ringbaData,
        blacklistMessage: null,
      });
    }

    // === STEP 6: BLA Blacklist Check ===
    const phoneToCheck =
      cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;
    let blacklistMessage = null;

    try {
      const blResponse = await axios.get(
        "https://api.blacklistalliance.net/lookup",
        {
          params: {
            key: "ggmNDKYZCX3QHkV9JKeT",
            phone: phoneToCheck,
          },
        }
      );

      blacklistMessage = blResponse.data.message;

      if (blacklistMessage?.toLowerCase() === "blacklisted") {
        return errorResponse(res, "Number Blocked by BLA added to DNC", {
          ringbaResponse: ringbaData,
          blacklistMessage,
          blocked: true,
        });
      }
    } catch (blError) {
      console.error("BLA API Error:", blError.message);
      blacklistMessage = "Blacklist check failed";
    }

    // === STEP 7: Save to Database and Sheet (only after Ringba & BLA success) ===
    if (formData._id) delete formData._id;

    const savedForm = await Form.create(formData);
    await appendFormDataToSheet(formData, "Form");

    return successResponse(
      res,
      "Form submitted and passed to Ringba successfully.",
      {
        savedForm,
        ringbaResponse: ringbaData,
        blacklistMessage,
        blocked: false,
      }
    );
  } catch (error) {
    console.error(
      "Error in createForm:",
      error?.response?.data || error.message
    );
    return errorResponse(
      res,
      error.message ||
        "An unexpected error occurred while submitting the form.",
      {},
      500
    );
  }
};

const checkFormByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    console.log("Received phone:", phone);

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    let formData = await Form.findOne({ phone: phone });
    if (!formData) {
      formData = await Form.findOne({ phone: Number(phone) });
    }

    console.log("Form fetched:", formData);

    if (formData) {
      return res
        .status(200)
        .json({ success: true, message: "Form data found", data: formData });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "No form found for this phone" });
    }
  } catch (error) {
    console.error("Error in checkFormByPhone:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error while checking phone" });
  }
};

// const checkFormByPhone = async (req, res) => {
//   try {
//       const { phone } = req.query;

//     if (!phone) {
//       return errorResponse(res, "Phone number is required");
//     }

//     const formData = await getFormDataByPhone(phone);
//     console.log('fetch phone no', formData)
//     if (formData) {
//       return successResponse(res, "Form data found", formData);
//     } else {
//       return errorResponse(res, "No form found for this phone");
//     }
//   } catch (error) {
//     console.error("Error in checkFormByPhone:", error.message);
//     return errorResponse(res, "Server error while checking phone");
//   }
// };

module.exports = {
  createForm,
  // getAllForms,
  checkFormByPhone,
};
