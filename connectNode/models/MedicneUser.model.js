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
    ForHowLong: { type: Number },
    StartDay: { type: Date },
    expandDateNo: { type: Number, default: 0 },
});

module.exports = mongoose.model("medicneusers", NewSchema);