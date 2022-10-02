const express = require("express");
const auth = require("../middlewares/auth.middleware");
const Checkout = require("../models/checkout.model");
const userService = require("../services/user.service");
const productService = require("../services/product.service");
const statisticsService = require("../services/statistics.service");
const checkoutService = require("../services/checkout.service");

const router = express.Router();
let orderArr = [];
router.get("/checkouts", auth, async(req, res) => {
    let getCheckout = await Checkout.find({});
    let user = await userService.findUserId(req.user.email);
    if (user.access > 1) {
        let checkout = await Checkout.find({ userId: user._id });

        for (let j = 0; j < checkout.length; j++) {
            for (let i = 0; i < checkout[j].Cart.length; i++) {
                let product = await productService.getProduct(
                    checkout[j].Cart[i].productId
                );
                if (product) {
                    product.Quantity = checkout[j].Cart[i].quantity;
                    product._id = checkout[j]._id;
                    console.log(product);
                    statisticsService.addTimeStamp(product._id, {
                        quantity: checkout[j].Cart[i].quantity,
                        date: new Date(),
                    });
                    console.log("innnnnn");
                    orderArr.push(product);
                }
            }
        }
        res.send(orderArr);
    } else res.status(401);
});
router.put("/updateDelivery/:_id", auth, async(req, res) => {
    let getCheckout = await checkoutService.updateCheckOut(
        req.params._id,
        req.body
    );
    if (getCheckout) res.send(getCheckout);
    else res.status(401);
});

// router.get("/checkoutAllproductBydates", auth, async(req, res) => {
//     let getCheckout = await Checkout.find({});
//     res.send(getCheckout);
// });

module.exports = router;