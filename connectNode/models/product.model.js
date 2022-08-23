const mongoose = require("mongoose");
const validator = require("validator");
const NewSchema = new mongoose.Schema({
    SerialNumber: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    Quantity: {
        type: Number,
        required: true,
    },
    Quantity_Of_Purchases: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: { type: String, required: true },
    category: { type: String, require: true },
    Reviews: [{
        SerialNumber: { type: Number },
        command: { type: String },
        date: { type: Date },
        _id: false,
    }, ],
});

module.exports = mongoose.model("products", NewSchema);