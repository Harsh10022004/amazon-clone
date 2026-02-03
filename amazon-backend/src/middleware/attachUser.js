/**
 * Authentication Bypass Middleware
 * Assignment Requirement: "Assume a default user is logged in"
 * Attaches User ID 1 to every request
 */
const attachUser = (req, res, next) => {
  req.user = { id: 1 }; // Default logged-in user
  next();
};

module.exports = attachUser;
