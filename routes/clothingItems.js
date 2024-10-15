const router = require("express").Router(); 
const { getItems, addItem, deleteItem, likeItem, dislikeItem }= require("../controllers/clothingItems")
const auth = require("../middleware/auth");
const { validateId, ClothingValidation} = require("../middleware/validation")


router.get("/", getItems);
router.post("/", auth, ClothingValidation, addItem);
router.delete("/:itemId", auth, validateId, deleteItem);  
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router; 