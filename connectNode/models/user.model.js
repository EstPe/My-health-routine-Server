const mongoose = require("mongoose");
const config = require("config");

let NewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    access: { type: Number, required: true },
    loginAttempts: { type: Number, required: true },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
});

module.exports = mongoose.model("users", NewSchema);