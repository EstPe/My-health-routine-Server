const express = require("express");
const auth = require("../middlewares/auth.middleware");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const cartService = require("../services/cart.service");
const userService = require("../services/user.service");
const checkoutService = require("../services/checkout.service");
const productService = require("../services/product.service");
const email = require("../services/sendEmail.service");
const orderService = require("../services/order.service");

const router = express.Router();

//add product to user's cart
router.put("/addToCart/:product", auth, async(req, res) => {
    //proudct exist
    let findProduct = await productService.productExist(req.body);
    if (findProduct.Quantity >= req.body.quantity) {
        //find user id
        let user = await userService.findUserId(req.user.email);
        req.body.userId = user._id;

        //does cart user exist?
        let cartExist = await cartService.userCart(user._id);

        //add new document to cart
        if (!cartExist) await cartService.addCart(user._id);
        req.body.userId = user._id;
        let productAlreadyInCart = await cartService.findProduct(req.body);
        console.log(`cartService ${productAlreadyInCart.quantity}`);
        //once found preson and product, the product will be added to the cart
        // && !productAlreadyInCart.quantity == req.body.quantity
        if (findProduct) {
            // if (user.access == 1) {
            Cart.updateOne({ userId: user._id }, {
                    $addToSet: {
                        Cart: {
                            productId: req.body.productId,
                            quantity: req.body.quantity,
                        },
                    },
                },
                (error, data) => {
                    if (data) {
                        res.json({
                            status: 201,
                            message: "product added to cart",
                        });
                        console.log("added");
                    } else {
                        res.json(error);
                    }
                }
            );
        }
        //  else {
        //     res.status(404).send("product already added to cart");
        // }
    } else {
        res.status(401).send("product already added to cart");
    }
});

router.get("/userCart", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let cartQuantity = await Cart.find({ userId: user._id });

    res.send(cartQuantity);
});
router.delete("/deleteCart/:productId", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    req.body.productId = req.params.productId;

    let findProduct = await cartService.findProduct(req.body);

    if (findProduct) {
        let find = await Cart.updateOne({
            _id: findProduct._id,
        }, { $pull: { Cart: { productId: [req.params.productId] } } });
        res.send(find);
    } else {
        res.status(401).json({ message: "cart did not exist" });
    }
});
router.post("/updateQuantity", auth, async(req, res) => {
    // getUser id
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    console.log(req.body);
    let findProduct = await productService.getProduct(req.body.productId);
    console.log(findProduct);
    if (findProduct.Quantity >= req.body.quantity) {
        let product = await cartService.updateQuantity(req.body);
        res.send(product);
    } else res.status(401).send("Invalid quantity");
});
router.delete("/checkout", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;

    let cartList = await Cart.findOne({
        userId: req.body.userId,
    }, { Cart: 1 });

    try {
        let exist = await checkoutService.checkout(
            new Date().toISOString().split("T")[0]
        );
        console.log(cartList);
        await orderService.findOrder(cartList, req.body.userId);
        if (!exist) {
            await checkoutService.addCheckOut(cartList);
        } else {
            for (let i = cartList.Cart.length - 1; i >= 0; i--) {
                await checkoutService.updateCheckOutForDay(cartList.Cart[i]);
            }
        }
        let sum = 0;
        for (let i = cartList.Cart.length - 1; i >= 0; i--) {
            let productOriginal = await productService.getProduct(
                cartList.Cart[i].productId
            );
            sum += JSON.parse(productOriginal.price);
            // if (productOriginal.Quantity >= cartList.Cart[i].quantity) {
            productOriginal.Quantity -= cartList.Cart[i].quantity;
            let pro = {
                SerialNumber: cartList.Cart[i].productId,
                Quantity: productOriginal.Quantity,
                Quantity_Of_Purchases: (productOriginal.Quantity_Of_Purchases += 1),
            };
            await productService.updateProduct(pro);
            // } else {
            //     res.status(401);
            //     return;
            // }
            console.log(sum);
        }
        console.log(`sum ${sum}`);
        email.order(cartList, user, sum);

        let find = await Cart.deleteOne({
            userId: user._id,
        });

        // addCartListToCheckOut
        res.send(find);
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;