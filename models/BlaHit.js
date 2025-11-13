const mongoose = require("mongoose");
const blaHitSchema = new mongoose.Schema({
  date: { type: String, required: true }, 
  campaign: { type: String, required: true },
  publisher: { type: String, required: true },
  count: { type: Number, default: 0 },
});

blaHitSchema.index({ date: 1, campaign: 1, publisher: 1 }, { unique: true });

module.exports = mongoose.model("BlaHit", blaHitSchema);
