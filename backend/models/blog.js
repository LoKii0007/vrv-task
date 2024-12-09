const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Science", "Health", "Business", "Entertainment", "Sports", "Travel", "Food", "Fashion", "Art", "Music", "Books", "Movies", "TV", "Gaming", "Other"],
  },
  upVotes: {
    type: Array,
    default: [],
  },
  downVotes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const blogSchema = mongoose.model("Blog", schema);

module.exports = blogSchema;
