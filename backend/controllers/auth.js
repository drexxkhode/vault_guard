function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // stop execution here
  }
  return res.status(401).json({ message: "Please login" });
}

module.exports = isAuthenticated;
