const Cart = require("../models/cart.model");
class CartService {
    addCart = async(userId) => {
        let newProduct = await Cart.create({
            userId: userId,
        });

        return newProduct;
    };
    userCart = async(userId) => {
        let newProduct = await Cart.findOne({
            userId: userId,
        });
        if (newProduct) return true;
        return false;
    };
    updateQuantity = async(cart) => {
        let find = await Cart.findOne({
            userId: cart.userId,
        }, { "Cart.productId": cart.productId, "Cart.quantity": cart.quantity });
        for (let i = find.Cart.length - 1; i >= 0; i--) {
            if (cart.productId === JSON.parse(find.Cart[i].productId)) {
                console.log(typeof find.Cart[i].quantity);
                // cart.quantity += find.Cart[i].quantity;
            }
        }
        let result = await Cart.updateOne({
            userId: cart.userId,
            "Cart.productId": cart.productId,
        }, {
            $set: {
                "Cart.$.quantity": cart.quantity,
            },
        });

        return result;
    };
    findProduct = async(productInCart) => {
        let find = await Cart.findOne({
            userId: productInCart.userId,
        }, { Cart: [{ productId: productInCart.productId }], _id: 1 });
        return find;
    };
}
const cartService = new CartService();
module.exports = cartService;