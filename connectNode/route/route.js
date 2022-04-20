const express = require("express");

const userCtrl = require("../controllers/userControllers");

const router = express.Router();

router.post("/users", userCtrl.createNewUser);
router.get("/users", userCtrl.getUsers);
router.get("/filterUsersById/:id", userCtrl.getUserById);
router.get("/filterUsersByEmail/:email", userCtrl.getUserByEmail);
router.put("/users/:id", userCtrl.updateUser);
module.exports = router;