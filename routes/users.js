const router = require("express").Router(); 
const { login, updateUser, createUser, getCurrentUser } = require("../controllers/users")
const auth = require("../middleware/auth")

// router.get("/:userId", getUserById);
router.patch("/users/me", auth, updateUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.get("/users/me", auth, getCurrentUser)

module.exports = router; 