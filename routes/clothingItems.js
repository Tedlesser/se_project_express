const router = require("express").Router(); 
const clothingItem = require("../controllers/clothingItems")

router.get("/", () => console.log("GET all items"));
router.post("/", () => console.log("POST new item"));
router.delete("/:itemId", () => console.log("DELETE by item ID"));
router.put("/:itemId/likes", () => console.log("Like by item ID"));
router.delete("/:itemId/likes", () => console.log("Dislike by item ID"));

module.exports = router; 