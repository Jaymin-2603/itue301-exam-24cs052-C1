// authGuard.js
// Middleware that protects routes by validating the Bearer token.
// Attaches req.member (decoded member info) for use in route handlers.

const jwt = require("jsonwebtoken");

function authGuard(req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // extract the token part

  try {
    // Verify the token using the same secret used to sign it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.member = decoded; // attach decoded payload to request
    next(); // token is valid, continue
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = authGuard;
