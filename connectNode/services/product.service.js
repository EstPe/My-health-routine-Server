const Product = require("../models/product.model");
class ProductService {
    getAllProducts = async() => {
        let result = await Product.find();
        return result;
    };
    getProduct = async(product) => {
        let result = await Product.findOne({ SerialNumber: product });
        return result;
    };

    addProduct = async(product) => {
        let newProduct = await Product.create({
            SerialNumber: product.SerialNumber,
            name: product.name,
            Quantity: product.Quantity,
            Quantity_Of_Purchases: product.Quantity_Of_Purchases,
            price: product.price,
            image: product.image,
            category: product.category,
        });

        return newProduct;
    };
    productExist = async(product) => {
        let Exist = await Product.findOne({ SerialNumber: product.productId });
        if (Exist) {
            return Exist;
        }
        return false;
    };
    updateProduct = async(product) => {
        let updateProduct = Product.updateOne({ SerialNumber: product.SerialNumber }, { $set: product });
        return updateProduct;
    };
    soldOut = async() => {
        let QunatitSoldOut = await Product.find({
            Quantity: { $lt: 10 },
        });
        if (!QunatitSoldOut) return false;
        else return QunatitSoldOut;
    };
}
const productService = new ProductService();
module.exports = productService;