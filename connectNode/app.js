const express = require("express");
const cors = require("cors");
const productRouter = require("./routers/product.router");
const userRouter = require("./routers/user.router");
const cartRouter = require("./routers/cart.router");
const pharmacyRouter = require("./routers/pharmacy.router");
const MedicneUserRouter = require("./routers/MedicneUser.router");
const CheckOutRouter = require("./routers/checkout.router");
const OrderRouter = require("./routers/order.router");
const config = require("config");
require("./models/mongooseConection");
const app = express();
app.use(cors()); // website with any port to access the server -- middleware
app.use(express.json()); // when server recived a new request - parsing the body to json -- middleware

//http://localhost:3000/api/user/auth
app.use("/api/user", userRouter);

//http://localhost:3000/api/student  --- get
app.use("/api/product", productRouter);

//http://localhost:3000/api/cart  --- get
app.use("/api/cart", cartRouter);

//http://localhost:3000/api/cart  --- get
app.use("/api/pharmacy", pharmacyRouter);

//http://localhost:3000/api/cart  --- get
app.use("/api/MedicneUser", MedicneUserRouter);

//http://localhost:3000/api/cart  --- get
app.use("/api/Order", OrderRouter);

//http://localhost:3000/api/cart  --- get
app.use("/api/checkout", CheckOutRouter);
let port = config.get("port"); // please move it to config file
console.log("port", port);
app.listen(port, () => {
    console.log(`server is up and running on ${port}`);
});