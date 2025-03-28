const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviews: [
      {
        review: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

RatingSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
