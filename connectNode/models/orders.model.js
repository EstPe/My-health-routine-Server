const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    Cart: [{ productId: { type: Number }, date: { type: Date }, _id: false }],
});

module.exports = mongoose.model("orders", NewSchema);