const User = require("../models/user.model");
class UserService {
    getUsers = async() => {
        let result = await User.find();

        return result;
    };

    addUser = async(user) => {
        let newUser = await User.create({
            name: user.name,
            age: user.age,
            email: user.email,
            password: user.password,
            loginAttempts: user.loginAttempts,
            access: user.access,
            image: user.image,
            phone: user.phone,
        });

        return newUser;
    };
    userExist = async(user) => {
        let existByEmail = await User.findOne({ email: user.email });
        let existById = await User.findOne({ _id: user._id });
        if (existByEmail || existById) {
            return true;
        }
        return false;
    };
    updateUser = async(user) => {
        let updateUser = User.updateOne({ _id: user._id }, { $set: user });
        return updateUser;
    };
    findUserId = async(userEmail) => {
        let user = await User.findOne({ email: userEmail });
        return user;
    };
}
const userService = new UserService();
module.exports = userService;