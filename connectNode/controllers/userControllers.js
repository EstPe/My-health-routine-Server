const user = require("../models/user");
const User = require("../models/user");

const createNewUser = async(req, res) => {
    const body = req.body;
    try {
        //console.log(`exciption ${data}`);
        const user = new User(body);
        const FindUser = await User.findOne({ email: user.email });
        if (!FindUser) {
            await user.save();
            res.status(200).send(user);
        } else {
            return res
                .status(400)
                .json({ status: 400, email: "email already exists" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, email: "worng email" });
    }

    // user
    //     .save()
    //     .then(() => {
    //         return res.status(201).json({
    //             success: true,
    //             id: user._id,
    //             message: "New user has been created!",
    //         });
    //     })
    //     .clone()
    //     .catch((error) => {
    //         return res.status(401).json({
    //             error,
    //             message: "User has not been created!",
    //         });
    //     });
};

const getUsers = async(req, res) => {
    await User.find({}, (err, users) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!users.length) {
                return res.status(404).json({ success: false, error: `User not found` });
            }
            return res.status(200).json({ success: true, data: users });
        })
        .clone()
        .catch((err) => console.log(err));
};

const getUserById = async(req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!user) {
                return res.status(404).json({ success: false, error: `User not found` });
            }
            return res.status(200).json({ success: true, data: user });
        })
        .clone()
        .catch((err) => console.log(err));
};

const getUserByEmail = async(req, res) => {
    await User.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!user) {
                return res.status(404).json({ success: false, error: `User not found` });
            }
            return res.status(200).json({ success: true, data: user });
        })
        .clone()
        .catch((err) => console.log(err));
};
const updateUser = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: "Movie not found!",
            });
        }
        user.loginAttempts = body.loginAttempts;
        if (user.loginAttempts === 4) {
            console.log(user.password);
            console.log(body.password);
            if (user.password != body.password) {
                user.password = body.password;
                user.loginAttempts = 0;
            }
        }
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: "User updated!",
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: "User not updated!",
                });
            });
    });
};

module.exports = {
    createNewUser,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUser,
};