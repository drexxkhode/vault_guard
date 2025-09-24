const errors = (err, req, res, next) => {
  // Handle CSRF error
  if(res.headersSent){
    console.error("Headers already sent for this reponse ");
    return next(err);
  }
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF Token" });
  }

  // Default: Internal server error
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errors;
