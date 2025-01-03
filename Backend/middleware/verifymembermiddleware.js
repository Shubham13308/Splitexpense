const jwt = require("jsonwebtoken");
require('dotenv').config();

const validatememberLogin = (req, res, next) => {
  
  const token = req.headers["authorization"];
  // console.log("Token received:", token);  

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Token is required",  
    });
  }

  
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(403).json({
      status: "error",
      message: "Invalid token format",
    });
  }

  const jwtToken = tokenParts[1];

  // Decode the JWT token without verification to check expiration
  const decoded = jwt.decode(jwtToken);
  // console.log("Decoded token:", decoded);

  // Check if token has expired
  if (decoded && decoded.exp < Date.now() / 1000) {
    return res.status(403).json({
      status: "error",
      message: "Token is expired",
    });
  }


  // console.log("JWT Secret:", process.env.SECRET_KEY);


  jwt.verify(jwtToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // console.log("JWT verification error:", err);  
      return res.status(403).json({
        status: "error",
        message: "Invalid or expired token",  
      });
    }

    // console.log("Decoded token after verification:", decoded);  
    req.admin = decoded;  
    next();  
  });
};

module.exports = validatememberLogin;
