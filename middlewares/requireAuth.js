const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  console.log("Incoming Headers:", req.headers);
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  // Check if the token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info (e.g., userId) to the request object
    req.user = { id: decoded.id };
    // Call the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = requireAuth;
