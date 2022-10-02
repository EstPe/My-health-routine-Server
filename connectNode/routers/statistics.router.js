const express = require("express");
const auth = require("../middlewares/auth.middleware");
const statisticsService = require("../services/statistics.service");
const Product = require("../models/product.model");
const Statistics = require("../models/statistics.model");
const router = express.Router();

router.get("/getStatistics", async(req, res) => {
    let result = await Statistics.find({});
    let statisticsArr = [];
    for (let i = 0; i < result.length; i++) {
        let product = await Product.findOne({ _id: result[i].productId });
        statisticsArr.push({ product, timeArr: result[i].time });
    }
    res.send(statisticsArr);
});

module.exports = router;