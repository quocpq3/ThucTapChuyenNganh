const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
