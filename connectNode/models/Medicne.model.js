const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    nameMed: { type: String },
    MgQuantity: { type: Number },
    takingRecommend: {
        AmountOfPills: { type: Number },
        ForHowLong: { type: Number },
    },
    DrugConflict: [{
        medName: { type: String },
        _id: false,
    }, ],
});

module.exports = mongoose.model("medicans", NewSchema);