const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    nameMed: { type: String },
    size: { type: Number },
    takingRecommend: { type: String },
    DrugConflict: [{
        medName: { type: String },
        _id: false,
    }, ],
});

module.exports = mongoose.model("medicans", NewSchema);