const router = require("express").Router(); 
const { getUsers, createUser, getUserById, login, getCurrentUser } = require("../controllers/users")

router.get("/:userId", getUserById);
router.post("/signin", login);
router.get('/users', getUsers);

module.exports = router; 