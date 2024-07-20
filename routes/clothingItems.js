const router = require("express").Router(); 
const { getItems, addItem, deleteItem }= require("../controllers/clothingItems")

router.get("/", getItems);
router.post("/", addItem);
router.delete("/:itemId", deleteItem);

module.exports = router; 