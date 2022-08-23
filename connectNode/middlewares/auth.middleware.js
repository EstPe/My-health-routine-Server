const jwt = require("jsonwebtoken");
const config = require("config");

// req - request
// res - response
// next - next function to call in the chain
function auth(req, res, next) {
    const token = req.header("token"); //jenfrie48949we3rosdnriu34h95fgjhjfk
    console.log(token);
    if (token === undefined || token === "") {
        console.log("user not authenticated");
        res.status(401).send("Access denied please login!");
        return;
    }
    try {
        let user = jwt.verify(token, config.get("jwtPrivateKey")); //decode
        console.log(user);
        console.log("user authenticated");
        req.user = user; //שרשור
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send("Invalid token");
    }
}

module.exports = auth;