const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  UserInfoBodyValidation,
  AuthenticationBody,
} = require("../middleware/validation");
const NotFoundError = require("../utils/NotFoundError");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", UserInfoBodyValidation, createUser);
router.post("/signin", AuthenticationBody, login);

router.use((req, res) => {
  const error = new NotFoundError("Requested resource not found");
  next(error);
});

module.exports = router;
