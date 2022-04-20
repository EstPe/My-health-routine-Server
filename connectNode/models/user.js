const mongoose = require("mongoose");
const validator = require("validator");
const NewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isAlpha(value)) throw new Error("only letters");
        },
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("is not an email");
        },
    },
    password: {
        type: String,
        required: true,
        tirm: true,
    },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    access: { type: Number, required: true },
    loginAttempts: { type: Number, required: true },
});

module.exports = Users = mongoose.model("users", NewSchema);