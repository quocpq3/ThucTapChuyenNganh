const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EndowSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  // 👉 loại khuyến mãi
  type: {
    type: String,
    enum: ["percent", "amount", "combo"],
    required: true,
    default: "percent",
  },

  // 👉 giá trị khuyến mãi
  value: {
    type: Number,
    default: 0,
  },

  status: {
    type: Boolean,
    default: true,
  },

  amenity: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Endow", EndowSchema);
