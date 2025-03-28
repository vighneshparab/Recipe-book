const express = require("express");
const CookingTip = require("../models/CookingTip");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new cooking tip (Protected Route)
router.post("/", protect, async (req, res) => {
  const { tip } = req.body;

  try {
    const cookingTip = await CookingTip.create({
      tip,
      createdBy: req.user._id, // Attach the logged-in user's ID
    });

    res.status(201).json(cookingTip);
  } catch (error) {
    console.error("Error creating cooking tip:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// Get all cooking tips (Public Route)
router.get("/", async (req, res) => {
  try {
    const cookingTips = await CookingTip.find().populate(
      "createdBy",
      "name email"
    );
    res.status(200).json(cookingTips);
  } catch (error) {
    console.error("Error fetching cooking tips:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single cooking tip by ID (Public Route)
router.get("/:id", async (req, res) => {
  try {
    const cookingTip = await CookingTip.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!cookingTip) {
      return res.status(404).json({ message: "Cooking tip not found" });
    }

    res.status(200).json(cookingTip);
  } catch (error) {
    console.error("Error fetching cooking tip:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// Update a cooking tip (Protected Route - Only the creator can update)
router.put("/:id", protect, async (req, res) => {
  try {
    const cookingTip = await CookingTip.findById(req.params.id);

    if (!cookingTip) {
      return res.status(404).json({ message: "Cooking tip not found" });
    }

    // Check if the logged-in user is the creator of the cooking tip
    if (cookingTip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedCookingTip = await CookingTip.findByIdAndUpdate(
      req.params.id,
      { tip: req.body.tip },
      { new: true }
    );

    res.status(200).json(updatedCookingTip);
  } catch (error) {
    console.error("Error updating cooking tip:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a cooking tip (Protected Route - Only the creator can delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const cookingTip = await CookingTip.findById(req.params.id);

    if (!cookingTip) {
      return res.status(404).json({ message: "Cooking tip not found" });
    }

    // Check if the logged-in user is the creator of the cooking tip
    if (cookingTip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await cookingTip.remove();
    res.status(200).json({ message: "Cooking tip deleted" });
  } catch (error) {
    console.error("Error deleting cooking tip:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
