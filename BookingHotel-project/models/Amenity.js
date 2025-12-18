const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmenitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Amenity", AmenitySchema);
