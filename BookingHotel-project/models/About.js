const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutSchema = new Schema(
  {
    title: {
      type: String,
      default: "Về chúng tôi",
    },
    description: {
      type: String,
      default: "",
    },
    number: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
