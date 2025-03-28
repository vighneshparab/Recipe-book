const express = require("express");
const Recipe = require("../models/Recipe");
const Rating = require("../models/Rating");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new recipe (Protected Route)
router.post("/", protect, async (req, res) => {
  const { title, description, ingredients, steps, category, tags, image } =
    req.body;

  try {
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      category,
      tags,
      image,
      createdBy: req.user._id, // Attach the logged-in user's ID
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all recipes (Public Route)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get recipes created by the logged-in user (Protected Route)
router.get("/my-recipes", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Ensure the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized: Invalid user ID" });
    }

    // Fetch recipes created by the user and populate the createdBy field
    const recipes = await Recipe.find({ createdBy: userId }).populate(
      "createdBy",
      "name email"
    );

    // Check if recipes were found
    if (!recipes || recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for this user" });
    }

    // Return the recipes
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/saved-recipes", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`Fetching saved recipes for user: ${userId}`);

    // Ensure MongoDB is connected
    if (!mongoose.connection.readyState) {
      console.error("MongoDB not connected!");
      return res.status(500).json({ message: "Database connection error" });
    }

    // Find the user and populate saved recipes
    const user = await User.findById(userId)
      .populate({
        path: "savedRecipes",
        select: "title description ingredients steps category tags image",
      })
      .lean();

    // Check if user or savedRecipes exist
    if (
      !user ||
      !Array.isArray(user.savedRecipes) ||
      user.savedRecipes.length === 0
    ) {
      console.error(`User not found or no saved recipes: ${userId}`);
      return res
        .status(404)
        .json({ message: "User not found or no saved recipes" });
    }

    console.log(
      `Saved recipes fetched successfully for user ${userId}:`,
      user.savedRecipes.length
    );
    res.status(200).json(user.savedRecipes);
  } catch (error) {
    console.error(`Error in /saved-recipes: ${error.message}`, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a recipe (Protected Route - Only the creator can delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the logged-in user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await recipe.remove();
    res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single recipe by ID (Public Route)
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a recipe (Protected Route - Only the creator can update)
router.put("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the logged-in user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a rating to a recipe (Protected Route)
router.post("/:id/rate", protect, async (req, res) => {
  const { rating, review } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already rated the recipe
    const existingRating = await Rating.findOne({
      user: req.user._id,
      recipe: req.params.id,
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this recipe" });
    }

    // Create a new rating
    const newRating = await Rating.create({
      user: req.user._id,
      recipe: req.params.id,
      rating,
      reviews: review ? [{ review }] : [],
    });

    // Calculate the new average rating
    const ratings = await Rating.find({ recipe: req.params.id });
    const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = totalRatings / ratings.length;

    await recipe.save();
    res.status(200).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a recipe to saved recipes (Protected Route)
router.post("/:id/save", protect, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    // Check if the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the recipe is already saved
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    // Add the recipe to the user's saved recipes
    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove a recipe from saved recipes (Protected Route)
router.delete("/:id/unsave", protect, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the recipe is in the user's saved recipes
    if (!user.savedRecipes.includes(recipeId)) {
      return res
        .status(400)
        .json({ message: "Recipe not found in saved recipes" });
    }

    // Remove the recipe from the user's saved recipes
    user.savedRecipes = user.savedRecipes.filter(
      (id) => id.toString() !== recipeId
    );
    await user.save();

    res.status(200).json({ message: "Recipe removed from saved recipes" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
