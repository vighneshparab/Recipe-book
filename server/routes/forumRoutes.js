const express = require("express");
const ForumPost = require("../models/ForumPost");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Create a forum post with image upload
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null; // Store only filename

  try {
    const forumPost = new ForumPost({
      title,
      content,
      image,
      createdBy: req.user._id,
    });

    await forumPost.save();
    res.status(201).json(forumPost);
  } catch (error) {
    console.error("Error creating forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all forum posts
router.get("/", async (req, res) => {
  try {
    const forumPosts = await ForumPost.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(forumPosts);
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-community-posts", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch posts created by the logged-in user
    const forumPosts = await ForumPost.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(forumPosts);
  } catch (error) {
    console.error("Error fetching user's community posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single forum post by ID
router.get("/:forumPostId", async (req, res) => {
  const { forumPostId } = req.params;

  try {
    const forumPost = await ForumPost.findById(forumPostId).populate(
      "createdBy",
      "name email"
    );
    if (!forumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.status(200).json(forumPost);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a forum post (only by the owner)
router.put(
  "/:forumPostId",
  protect,
  upload.single("image"),
  async (req, res) => {
    const { title, content } = req.body;
    const { forumPostId } = req.params;
    const image = req.file ? req.file.filename : null; // Store only filename

    try {
      const forumPost = await ForumPost.findById(forumPostId);
      if (!forumPost) {
        return res.status(404).json({ message: "Forum post not found" });
      }

      if (forumPost.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      forumPost.title = title || forumPost.title;
      forumPost.content = content || forumPost.content;
      if (image) forumPost.image = image;

      await forumPost.save();
      res.status(200).json(forumPost);
    } catch (error) {
      console.error("Error updating forum post:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a forum post (only by the owner)
router.delete("/:forumPostId", protect, async (req, res) => {
  const { forumPostId } = req.params;

  try {
    const forumPost = await ForumPost.findById(forumPostId);
    if (!forumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    if (forumPost.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ForumPost.deleteOne({ _id: forumPostId });
    res.status(200).json({ message: "Forum post deleted" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in user's own community posts

module.exports = router;
