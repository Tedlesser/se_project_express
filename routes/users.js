const router = require("express").Router(); 
const { getCurrentUser, login, updateUser } = require("../controllers/users")

// router.get("/:userId", getUserById);
router.post("/signin", login);
router.get('/me', getCurrentUser);
router.patch("/me", updateUser);

module.exports = router; 