const Checkout = require("../models/checkout.model");
class CheckoutService {
    addCheckOut = async(cartList) => {
        let newProduct = await Checkout.create({
            date: new Date().toISOString().split("T")[0],
        });
        for (let i = 0; i < cartList.Cart.length; i++) {
            this.addItemToCheckOut(cartList.Cart[i], newProduct);
        }
    };
    addItemToCheckOut = (cartList, newCHeckOut) => {
        Checkout.updateOne({ _id: newCHeckOut._id }, {
                $addToSet: {
                    Cart: {
                        productId: cartList.productId,
                        quantity: cartList.quantity,
                    },
                },
            },
            (error, data) => {
                if (data) {
                    console.log("added to checkout");
                } else {
                    console.log("did not added to checkout");
                }
            }
        );
    };
    updateCheckOutForDay = async(product) => {
        let checkOutDayList = await this.checkout(
            new Date().toISOString().split("T")[0]
        );
        let total = 0;
        for (let i = checkOutDayList.Cart.length - 1; i >= 0; i--) {
            if (checkOutDayList.Cart[i].productId == product.productId) {
                total = checkOutDayList.Cart[i].quantity + product.quantity;
            }
        }
        if (total == 0) this.addItemToCheckOut(product, checkOutDayList);
        else {
            await Checkout.updateOne({
                date: checkOutDayList.date,
                "Cart.productId": product.productId,
            }, {
                $set: {
                    "Cart.$.quantity": total,
                },
            });
        }
        return checkOutDayList;
    };
    checkout = async(thisDate) => {
        let newProduct = await Checkout.findOne({
            date: thisDate,
        });
        if (newProduct) return newProduct;
        return false;
    };
    updateCheckOut = async(id, checkout) => {
        let updateCheckOut = Checkout.updateOne({ _id: id }, { $set: checkout });
        return updateCheckOut;
    };
}
const checkoutService = new CheckoutService();
module.exports = checkoutService;