const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    productId: {
        type: String,
        require,
    },
    time: [{
        quantity: { type: Number },
        age: { type: Number },
        date: { type: Date },
        _id: false,
    }, ],
});

module.exports = mongoose.model("statistics", NewSchema);