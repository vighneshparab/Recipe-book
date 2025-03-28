const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    category: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

RecipeSchema.index({ category: 1, title: 1 });

module.exports = mongoose.model("Recipe", RecipeSchema);
