const express = require("express");
const router = express.Router();

const loginController = require("../controller/login.controller");
const registerController = require("../controller/register.controller");

// POST /auth/login
router.post("/login", loginController.login);

// POST /auth/register
router.post("/register", registerController.register);

module.exports = router;
