const mongoose = require("mongoose");
const config = require("config");

let NewSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    Cart: [
        { productId: { type: Number }, quantity: { type: Number }, _id: false },
    ],
});

module.exports = mongoose.model("cart", NewSchema);