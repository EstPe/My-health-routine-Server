const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    Cart: [
        { productId: { type: Number }, quantity: { type: Number }, _id: false },
    ],
    date: { type: Date },
    delivered: { type: Boolean },
});

module.exports = mongoose.model("checkouts", NewSchema);