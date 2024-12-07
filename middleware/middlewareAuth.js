const jwt = require("jsonwebtoken");

// Fungsi Middleware untuk memeriksa token JWT
function middlewareAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: 401,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({
        status: 401,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    req.user = user;
    next();
  });
}

module.exports = middlewareAuth;
