const express = require("express");
const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
const ForumPost = require("../models/ForumPost");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add a comment to a recipe (Protected Route)
router.post("/:recipeId/comments/recipe", protect, async (req, res) => {
  const { text } = req.body;
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const comment = new Comment({
      user: req.user._id,
      recipe: recipeId,
      text,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all comments for a recipe
router.get("/:recipeId/comments/recipe", async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const comments = await Comment.find({ recipe: recipeId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a comment
router.put("/comments/:commentId", protect, async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment
router.delete("/comments/:commentId", protect, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment to a forum post
router.post("/:forumPostId/comments/forum", protect, async (req, res) => {
  const { text } = req.body;
  const { forumPostId } = req.params;

  try {
    const forumPost = await ForumPost.findById(forumPostId);
    if (!forumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    const comment = new Comment({
      user: req.user._id,
      forumPost: forumPostId,
      text,
    });

    await comment.save();
    forumPost.comments.push(comment._id);
    await forumPost.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment to forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all comments for a forum post
router.get("/:forumPostId/comments/forum", async (req, res) => {
  const { forumPostId } = req.params;

  try {
    const forumPost = await ForumPost.findById(forumPostId);
    if (!forumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    const comments = await Comment.find({ forumPost: forumPostId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments for forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
