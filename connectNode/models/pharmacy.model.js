const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    namePharmacy: {
        type: String,
        require,
    },
    address: {
        citiy: { type: String },
        street: { type: String },
        numberStreet: { type: String },
    },
    phone: { type: String },
    openingDescription: { type: String },
});

module.exports = mongoose.model("pharmacies", NewSchema);