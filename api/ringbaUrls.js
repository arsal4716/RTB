const baseRingbaUrl = "https://rtb.ringba.com/v1/production/";
const ringbaId = {
  BaliTech: {
    "ACA-Xfers-CPL-RTB": "dd5c87632b624e5888563fd62c32bcde.json",
    "ACA-Xfers-CPL-Scrub -RTB": "fbc3f176a60f4115b08622bce5a55de2.json",
    "FE-ENG-Xfers - RTB": "a361d8773332456983a1b9c295553707.json",
    "Auto-RTB-Insured-Private": "0fce0a3854dd4743a4ddea7431f3587d.json",
    "ACA-Xfers-CPL-RTB-TOKEN": "8d672312e43c4c879172d88d70dd4cb6.json",
    "U65-Xfers-20K-PH -RTB": "001781a86fd142d0964a947dc73b09e1.json",
    "ACA-Xfers-CPL-RTB - NonLIQLE (REG)":
      "067e4ec487c9487ab8b8baae029831e3.json",
    "ACA-Xfers-CPL-RTB-LIQLE": "450fcd7320fa414295f447d0016df7f4.json",
    "Medicare-CPA-Xfers-ENG": "74d79a8336dd40cf996075c8db7030a2.json",
    "Medicare-ENG-WarmXfers": "c224e2ab0ed741d9a6ff14e62467606a.json",
  },
  BT02: {
    "Medicare-CPA-Xfers-ENG": "74d79a8336dd40cf996075c8db7030a2.json",
  },
  "Leads Expert": {
    "ACA-Xfers-CPL-RTB": "df87a13b4d9249a386676cd22000b6a4.json",
    "ACA-Xfers-CPL-Scrub -RTB": "cd5a450dba344361afb20397d184d76a.json",
    "FE-ENG-Xfers - RTB": "52d57645e71c4f8797a1d48d07591793.json",
    "FE-ENG-CPA-RTB": "76414663207f4de08ee2f829d301af83.json",
    "U65-Xfers-20K-PH -RTB": "d1c6c56e4ff748b782be70714763af71.json",
    "Medicare-CPA-Xfers-RTB": "efdbaab4c0dd49dfa503d74b99c5a7a7.json",
    "ACA-Xfers-RevShare - RTB": "bcdd5c3142fb46c2a95ce63bf312afae.json",
    "NSBAGroup-ACA-Xfers-Downsel": "97d1aef0f3144b14a46b80f66cfea568.json",
    "Medicare-ENG-WarmXfers": "65a4065a7e6743daa94b2893ab103ec9.json",
  },
  Assured: {
    "ACA-Xfers-CPL-RTB": "17ae5253e1cb4a79a1dcf3d75a65f9d5.json",
  },
  "Workerz LLC": {
    "ACA-CPL-Scrub": "291e38b617db4ed7bbc24bdfe1d3b2a8.json",
  },
  Quativa: {
    "ACA-Xfers-CPL-Scrub -RTB": "216e38c8c61d462db1faa0a345c7a26c.json",
  },
  BMI: {
    "ACA-Xfers-CPL-Scrub -RTB": "779b8a53d0d342979997070a02e926bb.json",
    "ACA-Xfers-CPL-RTB": "b1d3433067814002b57431e03f0792b2.json",
  },
  MXZ: {
    "ACA-Scrub": "982c4773e68c4c6da3f11cafeaaaea3f.json",
  },
  RNT: {
    "ACA-CPL-Scrub": "8b75ddbcc05943c08ef8fa5f8c8e9ed8.json",
    "FE-ENG-CPA-RTB": "4f5a4b01654348eb802369d675cb2042.json",
  },
  "Actual Sales": {
    "MVA-Xfers": "77dba2c5319749a0b7270fe6eea4787d.json",
  },
};

module.exports = { baseRingbaUrl, ringbaId };
