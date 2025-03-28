const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: false,
    },
    forumPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumPost",
      required: false,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
