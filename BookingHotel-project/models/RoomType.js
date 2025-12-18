const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomTypeSchema = new Schema({
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
  basePrice: {
    type: Number,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  amenities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
});

module.exports = mongoose.model("RoomType", RoomTypeSchema);
