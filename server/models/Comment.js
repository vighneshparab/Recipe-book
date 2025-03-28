const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      default: null,
    },
    forumPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumPost",
      default: null,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

CommentSchema.index({ recipe: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", CommentSchema);
