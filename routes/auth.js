const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();

router.post("/signup", authController.post_signup);
router.post("/login", authController.post_login);
router.post("/guest-login", authController.post_guest_login);
// router.post("/login", authController.post_login);

module.exports = router;
