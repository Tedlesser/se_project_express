const router = require("express").Router(); 
const { getItems, addItem, deleteItem, updateItem, likeItem, dislikeItem }= require("../controllers/clothingItems")

router.get("/", getItems);
router.post("/", addItem);
router.delete("/:itemId", deleteItem);  
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router; 