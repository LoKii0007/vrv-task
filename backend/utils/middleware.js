const jwt = require("jsonwebtoken");
require("dotenv").config();

//? ------------------------------
//? Middleware to verify the JWT token
//? ------------------------------
const verifyUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log('no token');
    return res.status(401).json({ msg: "Access denied. Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) { // `exp` is in seconds; convert to ms
      return res.status(401).json({ msg: "Token expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ msg: "Invalid token." });
  }
};


module.exports = { verifyUser };
