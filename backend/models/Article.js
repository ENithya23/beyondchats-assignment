const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  updated: { type: Boolean, default: false },
  references: [String]
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
