const mongoose = require("mongoose");

let NewSchema = new mongoose.Schema({
    userId: {
        type: String,
        require,
    },
    MedicneName: {
        type: String,
    },
    MgQuantity: { type: Number },
    TakingTime: {
        Morning: {
            approvDate: { type: Date },
            time: { type: String },
            alert: { type: String },
            status: { type: String },
        },
        Noon: {
            approvDate: { type: Date },
            time: { type: String },
            alert: { type: String },
            status: { type: String },
        },
        Evening: {
            approvDate: { type: Date },
            time: { type: String },
            alert: { type: String },
            status: { type: String },
        },
    },
    AmountOfPills: { type: Number },
    CapletsByHour: { type: Number },
    StartDay: { type: Date },
});

module.exports = mongoose.model("medicneusers", NewSchema);