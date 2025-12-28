const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema(
  {
    title: {
      type: String,
      default: "Liên hệ",
    },
    description: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
