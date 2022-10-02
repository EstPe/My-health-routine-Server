const express = require("express");
const Order = require("../models/orders.model");
const orderSrevice = require("../services/order.service");
const userService = require("../services/user.service");
const productService = require("../services/product.service");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/getUserOrder", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let order = await Order.findOne({ userId: user._id });
    let orderArr = [];
    if (order) {
        for (let i = 0; i < order.Cart.length; i++) {
            let product = await productService.getProduct(order.Cart[i].productId);
            orderArr.push({ product, date: order.Cart[i].date });
        }
        res.send(orderArr);
    }
    res.status(404);
});

router.get("/getOrders", auth, async(req, res) => {
    let orderArr = [];
    let user = await userService.findUserId(req.user.email);
    if (user.access > 1) {
        let order = await Order.find();

        for (let j = 0; j < order.length; j++) {
            for (let i = 0; i < order[j].Cart.length; i++) {
                let product = await productService.getProduct(
                    order[j].Cart[i].productId
                );
                orderArr.push({ product, date: order[j].Cart[i].date });
            }
        }
        res.send(orderArr);
    }
    res.status(404);
});

module.exports = router;