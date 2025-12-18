const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomType: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rooms", RoomSchema);
