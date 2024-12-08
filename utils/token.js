const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60; // 3 days

const generatetoken = (userId, email) => {
  return jwt.sign(
    { id: userId, email: email }, // Include email in the payload
    process.env.JWT_SECRET,
    { expiresIn: maxAge }
  );
};

module.exports = generatetoken;
