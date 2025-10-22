const fieldConfig = {
  BaliTech: {
    "ACA-Xfers-CPL-RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income","QLE","Age"],
    "ACA-Xfers-CPL-Scrub -RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income","QLE","Age"],
    "FE-ENG-Xfers - RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income","Age"],
    "ACA-Xfers-CPL-Scrub -RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income","QLE","Age"],
    "ACA-Xfers-CPL-RTB-TOKEN": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","source_url","income","QLE"],
    "U65-Xfers-20K-PH -RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income","fname","lname","email"],
    "ACA-Xfers-CPL-RTB - NonLIQLE (REG)": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income"],
    "ACA-Xfers-CPL-RTB-LIQLE": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","jornaya_leadid","trusted_id","income"],
  },
  BT02:{
    "Medicare-CPA-Xfers-ENG": ["phone", "zipcode", "exposeCallerId","address","fname","lname","email","city","dob","ip_address", "agentName","state","jornaya_leadid","trusted_id","income","gender","Optin_Timestamp"],
  },
  "Leads Expert": {
    "ACA-Xfers-CPL-RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","Age"],
    "ACA-Xfers-CPL-Scrub -RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","Age"],
    "FE-ENG-Xfers - RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","Age"],
    "FE-ENG-CPA-RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","income","Age"],
    "U65-Xfers-20K-PH -RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","income","jornaya_leadid","fname","lname","email"],
    "ACA-Xfers-RevShare - RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","jornaya_leadid"],
    "Medicare-CPA-Xfers-RTB": ["phone", "zipcode", "exposeCallerId","address","fname","lname","email","city","dob","ip_address", "agentName","state","jornaya_leadid","income","gender","Optin_Timestamp"],
  },
  "Assured": {
    "ACA-Xfers-CPL-RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income"],
  },
  "Workerz LLC": {
    "ACA-CPL-Scrub": ["phone", "zipcode", "exposeCallerId", "agentName","state","income"],
  },
  Quativa: {
    "ACA-Xfers-CPL-Scrub -RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income"],
  },
  BMI: {
    "ACA-Xfers-CPL-Scrub -RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","Age"],
    "ACA-Xfers-CPL-RTB": ["QLE","phone", "zipcode", "exposeCallerId", "agentName","state","income","jornaya_leadid","Age" ],
  },
  "MXZ": {
    "ACA-Scrub": ["phone", "zipcode", "exposeCallerId", "agentName","state","income","QLE"],
  },
  "RNT": {
    "ACA-CPL-Scrub": ["phone", "zipcode", "exposeCallerId", "agentName","state","income","QLE","jornaya_leadid","Age"],
      "FE-ENG-CPA-RTB": ["phone", "zipcode", "exposeCallerId", "agentName","state","Age"],
  },
};

module.exports = fieldConfig;
