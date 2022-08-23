const express = require("express");
const auth = require("../middlewares/auth.middleware");
const Product = require("../models/product.model");
const productService = require("../services/product.service");
const email = require("../services/sendEmail.service");
const userService = require("../services/user.service");
const router = express.Router();

router.get("/products", auth, async(req, res) => {
    let allProducts = await productService.getAllProducts();
    let soldOut = await productService.soldOut();
    let user = await userService.findUserId(req.user.email);
    if (soldOut && user.access === 3) {
        email.soldOut(soldOut);
    }
    res.send(allProducts);
});
router.get("/product/:SerialNumber", auth, async(req, res) => {
    let allProducts = await productService.getProduct(req.params.SerialNumber);
    res.send(allProducts);
});

router.post("/addProduct", async(req, res) => {
    let lastSerialNumber = await Product.count();
    let product = {
        SerialNumber: ++lastSerialNumber,
        name: req.body.name,
        Quantity: req.body.Quantity,
        Quantity_Of_Purchases: req.body.Quantity_Of_Purchases,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category,
    };
    let exsit = await productService.productExist(product);
    if (exsit) {
        res.status(401).json({
            message: "User alredy exsit!",
        });
    } else {
        result = await productService.addProduct(product);
        res.send(result);
    }
});

router.delete("/deleteProduct/:SerialNumber", auth, async(req, res) => {
    const findProduct = await Product.findOne({
        SerialNumber: req.params.SerialNumber,
    });
    if (findProduct) {
        await Product.deleteOne({ SerialNumber: findProduct.SerialNumber });
        res.send(findProduct);
    } else {
        res.status(401).json({ message: "product did not exist" });
    }
});
router.post("/updateProduct/:SerialNumber", async(req, res) => {
    req.body.SerialNumber = req.params.SerialNumber;
    let update = await productService.updateProduct(req.body);
    if (update) {
        res.status(201).json({ message: "product details upadate successfully" });
    } else res.status(401).json({ message: "product did not update" });
});

router.get("/soldOut", auth, async(req, res) => {
    let QunatitSoldOut = await Product.find({
        Quantity: { $lt: 10 },
    });

    res.send(QunatitSoldOut);
});
router.get("/maxSales", auth, async(req, res) => {
    //add
    let MaxSales = await Product.aggregate([
        { $match: { $expr: { _id: "SerialNumber" } } },
        {
            $group: {
                _id: "$category",
                maxQuantity: {
                    $max: "$Quantity_Of_Purchases",
                },
            },
        },
    ]);
    let MaxSalesProduct = [];
    for (let i = 0; i < MaxSales.length; i++) {
        let product = await Product.findOne({
            Quantity_Of_Purchases: MaxSales[i].maxQuantity,
        });
        MaxSalesProduct.push(product);
    }
    console.log(MaxSalesProduct);
    if (MaxSales) res.send(MaxSalesProduct);
    else res.status(401);
});
router.post("/command/:SerialNumber", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    let ProductReviews = await Product.find({});
    let len = ProductReviews[0].Reviews.length;
    Product.updateOne({ SerialNumber: req.params.SerialNumber }, {
            $addToSet: {
                Reviews: {
                    SerialNumber: ++len,
                    command: req.body.command,
                    date: new Date(),
                },
            },
        },
        (error, data) => {
            if (data) {
                res.json({
                    status: 201,
                    message: "command added to cart",
                });
                console.log("added");
            } else {
                res.json(error);
            }
        }
    );
});
router.get("/getAllCommands/:SerialNumber", auth, async(req, res) => {
    let allCommands = await Product.find({ SerialNumber: req.params.SerialNumber }, { Reviews: 1 });
    if (allCommands) res.send(allCommands);
    else res.status(401);
});

module.exports = router;