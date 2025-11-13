const BlaHit = require("../models/BlaHit");
async function logBlaHit(publisher, campaign) {
  const today = new Date().toISOString().split("T")[0];
  try {
    await BlaHit.findOneAndUpdate(
      { date: today, publisher, campaign },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error logging BLA hit:", err.message);
  }
}
module.exports = {logBlaHit}