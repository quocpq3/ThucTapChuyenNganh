const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    guestName: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
    },

    // 🔹 Phòng
    room: {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "checked_out", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
