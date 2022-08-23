const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");
const userService = require("../services/user.service");
const email = require("../services/sendEmail.service");

const router = express.Router();

router.post("/register", async(req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        image: req.body.image,
        access: req.body.access,
        loginAttempts: req.body.loginAttempts,
    };
    let exsit = await userService.userExist(user);
    if (exsit) {
        res.status(404).json({
            message: "User alredy exsit!",
        });
    } else {
        result = await userService.addUser(user);
        let secret = config.get("jwtPrivateKey");
        let userInfo = { email: user.email };
        let token = jwt.sign(userInfo, secret);
        console.log(token);
        email.newUser(user);
        res.send(JSON.stringify(token));
    }
});

router.post("/login", async(req, res) => {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user === undefined || user === null) {
        res.status(401).send("Invalid username or password");
        return;
    }
    if (user.password != req.body.password) {
        console.log("error password");
        if (user.loginAttempts > 2) {
            res.status(400).send("to many attempts try forget password");
            return;
        } else {
            user.loginAttempts++;
            await userService.updateUser(user);
            res.status(401).send("Invalid username or password");
            return;
        }
    }
    user.loginAttempts = 0;
    let secret = config.get("jwtPrivateKey");
    let userInfo = { email: user.email };
    let token = jwt.sign(userInfo, secret);

    res.status(200).send(JSON.stringify(token));
});
router.get("/users", auth, async(req, res) => {
    let users = await User.find();
    if (users) {
        res.send(users);
    } else {
        res.status(401).json({ message: "there is no users" });
    }
});

router.post("/forgetPassword", async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user === undefined || user === null) {
        res.status(401).send("Invalid email");
        return;
    }
    if (user) {
        console.log(req.body);
        user.password = req.body.password;
        user.loginAttempts = 0;
        await userService.updateUser(user);
        res.status(201).send(user);
        return;
    }
    res.status(401).json({ message: "user not found" });
});
router.get("/sendNewPass/:email", async(req, res) => {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 24;
    var randomstring = "";
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    let user = await userService.findUserId(req.params.email);
    if (req.params.email == user.email) {
        email.tempPassword(randomstring, user);
        res.send(JSON.stringify(randomstring));
    } else res.status(401).json({ message: "email not exist found" });
});
//get userInfo for user that alreay connected
router.get("/userInfo", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    res.send(user);
});
//get userInfo for user that manager what to make changes
router.get("/userInfo/:_id", auth, async(req, res) => {
    let user = await User.findOne({ _id: req.params._id });
    if (user) {
        res.send(user);
    } else res.status(401).json({ message: "wrong id" });
});
router.post("/updateUserInfo/:_id", auth, async(req, res) => {
    req.body._id = req.params._id;
    let emailExist = await userService.userExist(req.body);

    if (emailExist) {
        let update = await userService.updateUser(req.body);
        if (update) {
            res.status(201).json({ message: "user details upadate successfully" });
        } else res.status(401).json({ message: "user did not update" });
    } else res.status(401).json({ message: "user did not exist" });
});

router.delete("/deleteUser/:_id", auth, async(req, res) => {
    const FindUser = await User.findOne({ _id: req.params._id });
    if (FindUser) {
        await User.deleteOne({ _id: FindUser._id });
        res.send(FindUser);
    } else {
        res.status(401).json({ message: "user did not exist" });
    }
});
router.post("/Health-Statement", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body._id = user._id;
    let updateHealthStatement = await userService.updateUser(req.body);
    if (updateHealthStatement) res.send(updateHealthStatement);
    else res.status(401);
});

module.exports = router;