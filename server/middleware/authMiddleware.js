const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle token verification errors
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // Handle missing token
    console.error("No token provided");
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = protect;
