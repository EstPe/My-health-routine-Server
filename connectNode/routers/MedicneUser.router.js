const express = require("express");
const auth = require("../middlewares/auth.middleware");
const MedicneUser = require("../models/MedicneUser.model");
const MedicneUserService = require("../services/MedicneUser.service");
const userService = require("../services/user.service");
const User = require("../models/user.model");
const Medicne = require("../models/Medicne.model");
const email = require("../services/sendEmail.service");
const dateT = require("date-and-time");
var didApprove;
const router = express.Router();

router.post("/addMedicneUser", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    didApprove = {
        date: req.body.StartDay,
    };
    TakingTime = {
        Morning: {
            approvDate: req.body.StartDay,
            time: req.body.TakingTime.Morning.time,
            alert: req.body.TakingTime.Morning.alert,
        },
        Noon: {
            approvDate: req.body.StartDay,
            time: req.body.TakingTime.Noon.time,
            alert: req.body.TakingTime.Noon.alert,
        },
        Evening: {
            approvDate: req.body.StartDay,
            time: req.body.TakingTime.Evening.time,
            alert: req.body.TakingTime.Evening.alert,
        },
    };
    let UserMedicne = {
        userId: req.body.userId,
        MedicneName: req.body.MedicneName,
        MgQuantity: req.body.MgQuantity,
        TakingTime: TakingTime,
        AmountOfPills: req.body.AmountOfPills,
        CapletsByHour: req.body.CapletsByHour,
        StartDay: req.body.StartDay,
        didApprove: didApprove,
    };

    let result = await MedicneUserService.getMedicneUser(req.body);
    str = UserMedicne.didApprove.date.split("-")[2];
    str = str.split("T")[0];
    for (let i = 0; i < result.length; i++) {
        // result[i].didApprove.date.getDate() == str &&
        if (result[i].MedicneName == UserMedicne.MedicneName) {
            res.status(401).json({ message: "already exist" });
            return;
        }
    }
    result = await MedicneUserService.addMedicneUser(UserMedicne);
    res.send(result);
});

router.get("/getMedicneUser", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    let result = await MedicneUserService.getMedicneUser(req.body);
    res.send(result);
});
router.get("/getMedicnes", auth, async(req, res) => {
    let result = await Medicne.find({});
    res.send(result);
});

router.put("/updateMed/:_id", auth, async(req, res) => {
    req.body._id = req.params._id;
    let updateMed = await MedicneUserService.updateMedUser(
        req.body,
        req.user.email
    );
    if (updateMed) res.send(updateMed);
    else res.status(401);
});
router.delete("/deleteMedUser/:MedicneName", auth, async(req, res) => {
    const findMedicneUser = await MedicneUser.findOne({
        MedicneName: req.params.MedicneName,
    });
    if (findMedicneUser) {
        await MedicneUser.deleteOne({
            userId: findMedicneUser.userId,
            MedicneName: findMedicneUser.MedicneName,
        });
        res.send(findMedicneUser);
    } else {
        res.status(401).json({ message: "Medicne did not exist" });
    }
});
// router.delete("/deleteMedUserByCourrentDay", auth, async(req, res) => {
//     const findMedicneUser = await MedicneUser.find({
//         StartDay: { $lt: new Date() },
//     });
//     if (findMedicneUser) {
//         for (let i = 0; i < findMedicneUser.length; i++) {
//             await MedicneUser.deleteOne({
//                 userId: findMedicneUser[i].userId,
//             });
//         }
//         res.send(findMedicneUser);
//     } else {
//         res.status(401).json({ message: "Medicne did not exist" });
//     }
// });

router.get("/sendReminder", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let date = new Date();

    date.setDate(date.getDate() + 14);
    let findMedUser = await MedicneUserService.findMedUser(user._id);

    for (let i = 0; i < findMedUser.length; i++) {
        // let date = new Date();
        console.log(findMedUser[i]);
        date.setDate(
            findMedUser[i].StartDay.getDate() + findMedUser[i].CapletsByHour
        );
        if (MedicneUserService.checkAlertTime(findMedUser[i], date) != null) {
            if (
                findMedUser[i].StartDay.getMonth() == new Date().getMonth() &&
                findMedUser[i].StartDay.getFullYear() == new Date().getFullYear()
            ) {
                //  findMedUser[i].StartDay.toISOString().split("T")[0] ==
                //     new Date().toISOString().split("T")[0] ||
                //     findMedUser[i].StartDay.getDate() <= date.getDate()

                if (MedicneUserService.checkAlertTime(findMedUser[i], date)) {
                    // findMedUser[i].didApprove.time= findMedUser[i]
                    let updateApproveDate = MedicneUserService.updateApproveDate(
                        findMedUser[i],
                        MedicneUserService.checkAlertTime(findMedUser[i], user),
                        "send"
                    );
                    let p = await MedicneUserService.updateMedApprove(
                        user,
                        updateApproveDate
                    );
                    didApprove = findMedUser[i];
                    // meds = ele;
                    email.sendReminder(user);
                }
            }
        }
    }

    res.send(findMedUser);
});
router.get("/approved", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let findMedUser = await MedicneUserService.findMedUser(user);
    // findMedUser[0].didApprove = findMedUser[0].StartDay;
    let updateMed;
    // for (let i = 0; i < findMedUser.length; i++) {
    // if(findMedUser[i].didApprove.time)
    didApprove = MedicneUserService.approvDate(didApprove);
    if (didApprove) {
        if (didApprove.CapletsByHour >= 0) {
            didApprove.CapletsByHour -= 1;
            if (didApprove.CapletsByHour <= 3) {
                email.medRunOut(user);
            }
            updateMed = await MedicneUserService.updateMedApprove(user, didApprove);
        } else res.status(401);
    }
    // }
    if (updateMed) {
        res.send(updateMed);
    } else res.status(401);
});
router.get("/notApprovedIgnor", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let findMedUser = await MedicneUserService.findMedUser(user);
    findMedUser[0].StartDay = findMedUser[0].StartDay = dateT.addDays(
        findMedUser[0].StartDay,
        1
    );
    console.log(findMedUser[0].didApprove);
    let updateMed = await MedicneUserService.updateMedApprove(
        user,
        findMedUser[0]
    );

    if (updateMed) {
        res.send(updateMed);
    } else res.status(401);
});

module.exports = router;