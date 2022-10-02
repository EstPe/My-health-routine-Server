const Order = require("../models/orders.model");
class OrderService {
    //add
    addOrder = async(cartList, userId) => {
        let orderUserId;
        orderUserId = await Order.findOne({
            userId: userId,
        });

        if (!orderUserId) {
            orderUserId = await Order.create({
                userId: userId,
            });
        }

        for (let i = 0; i < cartList.Cart.length; i++) {
            this.addItemToOrder(cartList.Cart[i], orderUserId.userId);
        }
    };

    addItemToOrder = (cartList, orderUserId) => {
        Order.updateOne({ userId: orderUserId }, {
                $addToSet: {
                    Cart: {
                        productId: cartList.productId,
                        date: new Date(),
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