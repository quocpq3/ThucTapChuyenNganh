const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const UserScheme = new Scheme({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
  },
  name: {
    type: String,
    required: false,
    trim: true,
    minlength: 1,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("user", UserScheme);
