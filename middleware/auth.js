const token = authorization.replace("Bearer ", "");
const { JWT_SECRET } = require("../utils/config")
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors")

payload = jwt.verify(token, JWT_SECRET);

req.user = payload;
next();
