const { google } = require('googleapis');
const keys = require('../sheet.json');

const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1BenR44hQPPqsHRFIHIAZToqQ6pMbNz-VRNfUX9hLPeM';
/**
 * Append data to a specific sheet tab.
 * @param {Object} data - The form or register data.
 * @param {string} tabName - The sheet tab name to write into.
 */
async function appendFormDataToSheet(data, tabName = 'Form') {
  const values = [];

  if (tabName === 'Register') {
    values.push([
      data.agentName || '',
      data.email || '',
      data.ipAddress || '',
      data.userAgent || '',
      new Date().toISOString()
    ]);
  } else if (tabName === 'Form') {
    values.push([
      data.fname || '',
      data.lname || '',
      data.phone || '',
      data.email || '',
      data.zipcode || '',
      data.city || '',
      data.state || '',
      data.address || '',
      data.agentName || '',
      new Date().toISOString(),
      data.campaign || '',
      data.dob || '',
      data.publisher || '',
      data.jornaya_leadid || '',
      data.ip_address || '',
      data.Age || '',
      data.income || '',
      data.trusted_form || '',
      data.bidId || '',
    ]);
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  });
}

module.exports = { appendFormDataToSheet };
