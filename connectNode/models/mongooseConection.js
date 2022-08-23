const mongoose = require("mongoose");
const config = require("config");

mongoose
    .connect(
        `mongodb://${config.get("mongoConnectionstring.domain")}:${config.get(
      "mongoConnectionstring.port"
    )}/${config.get("mongoConnectionstring.dbName")}`
    )
    .then(() => {
        console.log("connected to mongo");
    })
    .catch((e) => {
        console.log(e);
    });