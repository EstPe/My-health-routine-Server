const express = require("express");
const cors = require("cors");
const productRouter = require("./routers/product.router");
const userRouter = require("./routers/user.router");
const cartRouter = require("./routers/cart.router");
const pharmacyRouter = require("./routers/pharmacy.router");
const MedicneUserRouter = require("./routers/MedicneUser.router");
const CheckOutRouter = require("./routers/checkout.router");
const OrderRouter = require("./routers/order.router");
const MedicneRouter = require("./routers/MedDataBase.router");
const StatisticsRouter = require("./routers/statistics.router");
const config = require("config");
require("./models/mongooseConection");
const app = express();
app.use(cors()); // website with any port to access the server -- middleware
app.use(express.json()); // when server recived a new request - parsing the body to json -- middleware

//http://localhost:3000/api/user/auth
app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/cart", cartRouter);

app.use("/api/pharmacy", pharmacyRouter);

app.use("/api/MedicneUser", MedicneUserRouter);
app.use("/api/Medicne", MedicneRouter);

app.use("/api/Order", OrderRouter);

app.use("/api/checkout", CheckOutRouter);

app.use("/api/Statistics", StatisticsRouter);

let port = config.get("port");
console.log("port", port);
app.listen(port, () => {
    console.log(`server is up and running on ${port}`);
});