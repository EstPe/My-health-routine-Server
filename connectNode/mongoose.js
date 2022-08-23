const mongoose = require("mongoose");
mongoose.connect(
    "mongodb://localhost:27017/My-Health-Routine", { useNewUrlParser: true }, //creat the path
    (err) => {
        if (!err) console.log("db connect");
        else console.log("db error");
    }
);