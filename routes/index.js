const router = require("express").Router(); 
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems")

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
    res.status(404).send("Address not found");
  });

module.exports = router; 
