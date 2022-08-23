const Order = require("../models/orders.model");
class OrderService {
    addOrder = async(cartList, userId) => {
        let order = await Order.create({
            userId: userId,
        });
        for (let i = 0; i < cartList.Cart.length; i++) {
            this.addItemToOrder(cartList.Cart[i], order.userId);
        }
    };
    findOrder = async(cartList, userId) => {
        let findUserId = await Order.findOne({
            userId: userId,
        });
        if (findUserId) {
            console.log(cartList);
            this.addItemToOrder(cartList, findUserId.userId);
        } else this.addOrder(cartList, userId);
    };
    addItemToOrder = (cartList, orderUserId) => {
        Order.updateOne({ userId: orderUserId }, {
                $addToSet: {
                    Cart: {
                        productId: cartList.productId,
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
}
const orderService = new OrderService();
module.exports = orderService;