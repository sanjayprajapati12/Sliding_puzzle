const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please add username"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    require: [true, "Please add a email"],
  },
  password: {
    type: String,
    trim: true,
    require: [true, "Please add a password"],
  },
  password2: {
    type: String,
    trim: true,
    require: [true, "Please add a password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  secretToken: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  time: {
    type: ["number"],
    default: 215999,
  },
});

module.exports = mongoose.model("User", UserSchema);
