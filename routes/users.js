const router = require("express").Router(); 
const { getUsers, createUser, getUserById, login, getCurrentUser } = require("../controllers/users")

router.get("/:userId", getUserById);
router.post("/signin", login);

module.exports = router; 