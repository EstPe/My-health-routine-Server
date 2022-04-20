const express = require("express");
const User = require("./models/user");
// const bodyParser = require("body-parser");
const cors = require("cors");
require("./mongoose");
const port = process.env.PORT || 8080;
const app = express();
const validator = require("validator");
const route = require("./route/route");
// var corsOptions = {
//     origin: "http://localhost:8080/My-Health-Routine",
// };

//module.exports = app;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(route);
// app.post("/users", async(req, res) => {
//     const body = req.body;
//     //console.log(body);
//     try {
//         var user = new User(body);
//         const FindUsers = await User.findOne({ email: user.email });

//         if (!FindUsers) {
//             await user.save();
//             return res.status(200).send(user);
//         } else {
//             return res
//                 .status(400)
//                 .json({ status: 400, email: "email already exists" });
//         }
//     } catch (error) {
//         return res.status(500).send({ status: 500, error });
//     }
// });

// // app.get("/users/:", async(req, res) => {
// //     try {
// //         var _id = req.body;
// //         console.log(_id);
// //         const getUserId = await User.findById(_id);
// //         console.log(getUserId);
// //         res.status(200).send(getUserId);
// //     } catch {
// //         res.status(500).send({ status: 500, message: "user id does not exists" });
// //     }
// // });
// // app.get("/users/:id", (req, res) => {
// //     try {
// //         var _id = req.params.id;
// //         User.findById(_id, (error, data) => {
// //             console.log(data);
// //             res.send(data);
// //         });
// //     } catch {
// //         res.status(500).send({ status: 500, message: "user id does not exists" });
// //     }
// // });
// app.get("/users/:email", (req, res) => {
//     try {
//         var _id = req.params.email;
//         User.findOne({ email: _id }, (error, data) => {
//             res.send(data);
//         });
//     } catch {
//         res.status(500).send({ status: 500, message: "user id does not exists" });
//     }
// });

// app.get("/users/:email", (req, res) => {
//     try {
//         var email = req.params.email;
//         console.log(email);
//         User.findOne({ email: email }, (error, data) => {
//             res.send(data);
//         });
//     } catch {
//         res.status(500).send({ status: 500, message: "user id does not exists" });
//     }
// });
// app.get("/users/:email", async(req, res) => {
//     try {
//         var user = req.params.email;
//         const getUser = await User.findOne({ email: user });
//         res.status(200).send(getUser);
//     } catch {
//         res
//             .status(500)
//             .send({ status: 400, message: "user email does not exists" });
//     }
// });

app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});