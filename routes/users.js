const router = require("express").Router(); 
const { getUsers, createUser, getUserById, login, getCurrentUser, updateUser } = require("../controllers/users")

router.get("/:userId", getUserById);
router.post("/signin", login);
router.get('/users', getUsers);
router.patch("/me", updateUser);

module.exports = router; 