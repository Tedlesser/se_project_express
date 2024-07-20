const clothingItem = require("../models/clothingItem")

const getItems = (req, res) => { 
    clothingItem
      .find({})
      .then((items) => {
        res.send(items);
      }).catch(() => 
          res.status(500).send({message: "Server side error"})
      );
}

const deleteItem = (req, res) => { 
    clothingItem
      .findByIdAndDelete(req.params.itemId)
      .orFail()
      .then((items) => { res.send(items);
      })
      .catch((err) => {
        if(err.name === "DocumentNotFoundError") {
            return res.status(404).send({ message: "Address/Item not found" })
        } 
        if(err.name === "CastError"){
            return res.status(400).send({message: "the server could not understand the request because of invalid syntax."})
        } 
        return res.status(500).send({message: "Server side error"})
    });
};


const addItem = (req, res) => { 
    const {name, weather, imageUrl } = req.body
    const owner = req.user._id;

    if (!name || !weather || !imageUrl) {
        return res.status(400).send({message: "the server could not understand the request because of invalid syntax."})
      }

    clothingItem
        .create({name, weather, imageUrl, owner})
        .then((items) =>  res.status(201).send(items))
        .catch((err) => { 
            if(err.name === "ValidationError") {
                return res.status(400).send({message: err})
            }
            return res.status(500).send({message: "Server side error"})
        })
}

module.exports = { getItems, deleteItem, addItem};

























