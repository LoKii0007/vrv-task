const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  blogs: {
    type: Array,
    default: [],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "superUser"],
  },
  permissions: {
    type: [String],
    enum: ["createBlog", "updateBlog", "deleteBlog", 'deleteUser', 'updateUser', 'createUser', 'updateUserPermissions', 'createSuperUser', 'updateSuperUserPermissions', 'deleteSuperUser', 'deleteOtherBlogs'],
    default: ['createBlog', 'updateBlog', 'deleteBlog'],
  },
  image: {
    type: String,
  },
  connectedAccounts: {
    type: Array,
    default: [],
  },
  googleId: {
    type: String,
  },
});

const userSchema = mongoose.model("User", schema);

module.exports = userSchema;