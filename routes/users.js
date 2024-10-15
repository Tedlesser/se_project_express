const router = require("express").Router(); 
const { updateUser, getCurrentUser } = require("../controllers/users")
const auth = require("../middleware/auth");
const {UpdateProfileValidation } =require("../middleware/validation")

// router.get("/:userId", getUserById);
router.patch("/me", auth, updateUser);
router.get("/me", auth, UpdateProfileValidation, getCurrentUser)

module.exports = router; 