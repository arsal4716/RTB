const Form = require("../models/Form");
const { appendFormDataToSheet } = require("../Helper/googleSheet");
const axios = require("axios");
const fieldConfig = require("./fieldConfig");
const stateNameToCode = require("./stateNameToCode");
const {logBlaHit} = require("./blaHitController")
const {
  ringbaId: serverRingbaIds,
  baseRingbaUrl,
} = require("../api/ringbaUrls");
const { successResponse, errorResponse } = require("../utils/response");
const { google } = require("googleapis");
const NodeCache = require("node-cache");
const keys = require("../sheet.json");
const cache = new NodeCache({ stdTTL: 4 * 60 * 60 });
const auth = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);
const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "10wDKwHfS5ytpOxSPIr89PG0J1hRoKQ7S_3Qvjk-Pqlk";
const TAB_NAME = "Database";

// === HELPER: FETCH AND CACHE GOOGLE SHEET DATA ===
async function getSheetNumbers() {
  const cached = cache.get("sheetNumbers");
  if (cached) {
    return cached;
  }

  console.log("Fetching fresh data from Google Sheets...");
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TAB_NAME}!A:A`,
    });

    const numbers = res.data.values?.flat() || [];
    cache.set("sheetNumbers", numbers);
    console.log(`Cached ${numbers.length} phone numbers from Google Sheet`);
    return numbers;
  } catch (err) {
    console.error("Google Sheet Fetch Error:", err.message);
    return [];
  }
}
getSheetNumbers();
setInterval(() => getSheetNumbers(), 4 * 60 * 60 * 1000);

// === FIELD MAP ===
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
  gender: "gender",
  Age: "Age",
  source_url: "http://isurewise.com/",
  jornaya_leadid: "jornaya_leadid",
  trusted_id: "trusted_id",
  income: "income",
  QLE: "QLE",
  ip_address: "ip_address",
  Optin_Timestamp: "Optin_Timestamp",
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

    // === STEP 1: Check Google Sheet
    let isDuplicateInSheet = false;
    try {
      const sheetNumbers = await getSheetNumbers();
      isDuplicateInSheet = sheetNumbers.includes(phoneWith1);
    } catch (sheetErr) {
      console.error("Google Sheet Cache Error:", sheetErr.message);
    }

    if (isDuplicateInSheet && !formData.forceRetry) {
      return errorResponse(
        res,
        "This phone number already exists in our internal DB.",
        { duplicateSource: "GoogleSheet" },
        400
      );
    }

    // === STEP 2: HealthConnect Scrub ===
    try {
      const healthURL = `https://hcs.tldcrm.com/api/public/dialer/ready/${phoneWith1}?qui=27053&adg=true`;
      const healthRes = await axios.get(healthURL);

      if (healthRes.data?.ready === 0 && !formData.forceRetry) {
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

    // === STEP 3: ZIP Code Check ===
    if (!zipcode) {
      return errorResponse(res, "ZIP Code is required after duplicate check");
    }

    if (
      (publisher === "BaliTech" || publisher === "BT02") &&
      (!formData.jornaya_leadid || !formData.trusted_id)
    ) {
      const campaignsToTry = ["ACA", "FE", "SSDI", "MediPlans"];
      try {
        for (let camp of campaignsToTry) {
          const scrubberResponse = await axios.get(
            `https://scrubber.balitech.org/api/search.php?phone=${formData.phone}&campaign=${camp}`
          );

          const scrubDataList = scrubberResponse.data?.data?.data;
          if (Array.isArray(scrubDataList)) {
            for (let record of scrubDataList) {
              const leadId = record[4];
              const ip_address = record[5];
              const Optin_Timestamp = record[6];
              const trustedFormUrl = record[7];
              if (leadId || trustedFormUrl || ip_address || Optin_Timestamp) {
                formData.jornaya_leadid = formData.jornaya_leadid || leadId || ".";
                formData.trusted_id = formData.trusted_id || trustedFormUrl || ".";
                formData.ip_address = formData.ip_address || ip_address || ".";
                formData.Optin_Timestamp =
                  formData.Optin_Timestamp || Optin_Timestamp;
                break;
              }
            }
          }
          if (formData.jornaya_leadid && formData.trusted_id) break;
        }

        if (!formData.jornaya_leadid && !formData.trusted_id) {
          return errorResponse(
            res,
            "Missing Jornaya Lead ID or Trusted Form ID after scrubber API check.",
            {},
            400
          );
        }
      } catch (err) {
        return errorResponse(
          res,
          `Error fetching Jornaya/Trusted Form from: ${err.message}`,
          {},
          500
        );
      }
    }
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
    console.log("api url", fullUrlWithQuery);
    const ringbaResponse = await axios.get(fullUrlWithQuery);
    const ringbaData = ringbaResponse.data;

    const bidId = ringbaData?.bidId;
    if (bidId) formData.bidId = bidId;

    // === STEP 5: Check Ringba Agent Response ===
    if (!ringbaData.phoneNumber) {
      return successResponse(res, "No agents available.", {
        ringbaResponse: ringbaData,
        bidId: bidId || null,
        blacklistMessage: null,
        blocked: false,
      });
    }

    // === STEP 6: Blacklist Check ===
    const phoneToCheck =
      cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;
    let blacklistMessage = null;

    try {
    await logBlaHit(publisher, campaign);
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

    // === STEP 7: Save Form ===
    if (formData._id) delete formData._id;
    formData.attemptId = `${phoneWith1}-${Date.now()}`;
    formData.attemptTime = new Date().toISOString();

    const savedForm = await Form.create(formData);
    await appendFormDataToSheet(formData, "Form");

    return successResponse(
      res,
      "Form submitted and passed to Ringba successfully.",
      {
        savedForm,
        ringbaResponse: ringbaData,
        bidId,
        blacklistMessage,
        blocked: false,
      }
    );
  } catch (error) {
    console.error("Error in createForm:", error?.response?.data || error.message);
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
