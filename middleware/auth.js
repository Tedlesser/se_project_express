const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

const auth = (req, res, next) => {
  console.log(JWT_SECRET);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthorizedError("Authorization header is missing or malformed");
  }
  const token = authorization.replace("Bearer ", "");
  console.log("Token", token);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload:", payload);
  } catch (err) {
    throw new UnauthorizedError("Authorization header is missing or malformed");
  }

  req.user = payload;
  if (req.user && req.user._id) {
    console.log("User ID:", req.user._id);
  } else {
    console.error("Token does not contain user ID");
  }

  return next();
};

module.exports = auth;
