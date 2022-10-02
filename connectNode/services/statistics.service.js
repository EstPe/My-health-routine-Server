const Statistics = require("../models/statistics.model");
class StatisticsService {
    addProductStatistics = async(product, timee) => {
        let productExist = await Statistics.findOne({ productId: product });
        if (!productExist) {
            productExist = await Statistics.create({
                productId: product,
            });
        }
        this.addTimeStamp(timee, productExist);
    };
    addTimeStamp = (timee, newStatistics) => {
        Statistics.updateOne({ productId: newStatistics.productId }, {
                $addToSet: {
                    time: {
                        quantity: timee.quantity,
                        date: timee.date,
                        age: timee.age,
                    },
                },
            },
            (error, data) => {
                if (data) {
                    console.log("added to statistics");
                } else {
                    console.log("did not added to statistics");
                }
            }
        );
    };
}
const Statisticsservice = new StatisticsService();
module.exports = Statisticsservice;