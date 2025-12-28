const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TermSchema = new Schema(
  {
    number: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Term", TermSchema);
