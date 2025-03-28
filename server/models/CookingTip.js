const mongoose = require("mongoose");

const CookingTipSchema = new mongoose.Schema(
  {
    tip: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CookingTip", CookingTipSchema);
