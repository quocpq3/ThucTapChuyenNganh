const User = require("../models/User");
const bcryptjs = require("bcryptjs");

async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const newUser = new User({ name, email, phone, role: "user" });
    const salt = await bcryptjs.genSalt(10);
    newUser.password = await bcryptjs.hash(password, salt);
    const userSave = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created",
      user: { id: userSave._id, email: userSave.email, name: userSave.name },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = { register };
