const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    // 🔹 User đặt phòng (nullable cho admin)
    user: {
      type: Schema.Types.ObjectId,
      ref: "user", // ✅ ĐÚNG tên model
      default: null, // admin tạo thì null
    },

    // 🔹 Thông tin khách (user lấy tự động, admin tự nhập)
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
      ref: "Rooms", // ✅ trùng model Rooms
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
