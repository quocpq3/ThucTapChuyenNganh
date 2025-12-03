const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Lấy token từ header hoặc cookie
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token không tìm thấy" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ" });
  }
}

module.exports = authMiddleware;
