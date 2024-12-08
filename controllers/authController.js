const User = require("../models/User");
const generateToken = require("../utils/token");

// signup
module.exports.post_signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);
    const token = generateToken(user.id, user.email);
    res.status(201).json({ userID: user.id, email: user.email, token });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};
// login
module.exports.post_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = generateToken(user.id, user.email);
    res.status(200).json({ userID: user.id, email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Guest Login
module.exports.post_guest_login = async (req, res) => {
  try {
    const token = generateToken({
      userId: "guest",
      email: "guest@123gmail.com",
    });

    const userId = "guest";
    const email = "guest@123gmail.com";

    res.status(200).json({ userId, email, token }); // Respond with guest details
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle errors gracefully
  }
};
