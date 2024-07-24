const router = require("express").Router(); 
const { getItems, addItem, deleteItem, likeItem, dislikeItem }= require("../controllers/clothingItems")

router.get("/", getItems);
router.post("/", addItem);
router.delete("/:itemId", deleteItem);  
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router; 