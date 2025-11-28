// middleware/isAdmin.js
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền truy cập admin" });
  }
  next();
}

module.exports = isAdmin;
