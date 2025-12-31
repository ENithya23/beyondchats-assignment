const express = require("express");
const Article = require("../models/Article");
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
});

// Read all
router.get("/", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// Update
router.put("/:id", async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(article);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
