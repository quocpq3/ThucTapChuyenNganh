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

    floor: {
      type: Number,
    },

    roomType: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "cleaning", "maintenance"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
