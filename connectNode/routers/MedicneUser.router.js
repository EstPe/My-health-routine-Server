const express = require("express");
const auth = require("../middlewares/auth.middleware");
const MedicneUser = require("../models/MedicneUser.model");
const MedicneUserService = require("../services/MedicneUser.service");
const userService = require("../services/user.service");
const User = require("../models/user.model");
const MedicneService = require("../services/MedDataBase.service");
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
        ForHowLong: req.body.ForHowLong,
        StartDay: req.body.StartDay,
        didApprove: didApprove,
    };

    let result = await MedicneUserService.onlyOneInMonth(req.body);
    str = UserMedicne.didApprove.date.split("-")[2];
    str = str.split("T")[0];

    if (result.length == 0) {
        result = await MedicneUserService.addMedicneUser(UserMedicne);
        res.send(result);
    } else {
        res.status(401).json({ message: "already exist" });
    }
    // for (let i = 0; i < result.length; i++) {
    //     // result[i].didApprove.date.getDate() == str &&
    //     if (result[i].MedicneName == UserMedicne.MedicneName) {
    //         res.status(401).json({ message: "already exist" });
    //         return;
    //     }
    // }
});

router.get("/getMedicneUser/:monthYear", auth, async(req, res) => {
    req.body.monthYear = req.params.monthYear;
    let user = await userService.findUserId(req.user.email);
    req.body.userId = user._id;
    let result = await MedicneUserService.getMedicneUser(req.body);
    if (result) {
        res.send(result);
    } else res.status(401);
});

router.put("/updateMed/:_id", auth, async(req, res) => {
    req.body._id = req.params._id;
    let updateMed = await MedicneUserService.updateMedUser(req.body);
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

router.get("/sendReminder", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let date = new Date();

    let findMedUser = await MedicneUserService.findMedUser(user._id);
    for (let i = 0; i < findMedUser.length; i++) {
        // if (MedicneUserService.checkAlertTime(findMedUser[i], date) != null) {
        if (
            findMedUser[i].StartDay.getMonth() == new Date().getMonth() &&
            findMedUser[i].StartDay.getFullYear() == new Date().getFullYear()
        ) {
            date.setDate(
                findMedUser[i].StartDay.getDate() + findMedUser[i].ForHowLong
            );

            let didNot_Approv = await MedicneUserService.didNotApprov(
                findMedUser[i],
                user
            );
            if (didNot_Approv) {
                if (findMedUser[i].expandDateNo == 5) {
                    findMedUser[i].TakingTime.Morning.approvDate = dateT.addDays(
                        findMedUser[i].TakingTime.Morning.approvDate,
                        findMedUser[i].ForHowLong
                    );
                    findMedUser[i].TakingTime.Noon.approvDate = dateT.addDays(
                        findMedUser[i].TakingTime.Noon.approvDate,
                        findMedUser[i].ForHowLong
                    );
                    findMedUser[i].TakingTime.Evening.approvDate = dateT.addDays(
                        findMedUser[i].TakingTime.Evening.approvDate,
                        findMedUser[i].ForHowLong
                    );
                    findMedUser[i].ForHowLong = 0;
                    await MedicneUserService.updateMedApprove(user, findMedUser[i]);
                    email.stopTaking(req.user.email);
                } else {
                    findMedUser[i].ForHowLong += 1;
                    findMedUser[i].expandDateNo += 1;
                    await MedicneUserService.updateMedApprove(user, findMedUser[i]);
                    email.missTaking(req.user.email);
                }
            }
            if (
                MedicneUserService.checkAlertTime(findMedUser[i], date) &&
                findMedUser[i].expandDateNo !== 5
            ) {
                let updateApproveDate = MedicneUserService.updateApproveDate(
                    findMedUser[i],
                    MedicneUserService.checkAlertTime(findMedUser[i], date),
                    "send"
                );
                await MedicneUserService.updateMedApprove(user, updateApproveDate);
                didApprove = findMedUser[i];
                console.log("send");
                email.sendReminder(user);
            }
            // }
        }
    }

    res.send(findMedUser);
});
router.get("/didnotAprov", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let didNot_Approv = await MedicneUserService.didNotApprov(didApprove, user);
    let date = new Date();
    date.setDate(didApprove.StartDay.getDate() + didApprove.ForHowLong);
    if (!didNot_Approv) {
        if (
            didApprove.TakingTime.Morning.time != "" &&
            didApprove.TakingTime.Morning.status == "send"
        ) {
            MedicneUserService.updateApproveDate(
                didApprove,
                MedicneUserService.checkAlertTime(didApprove, date),
                "send"
            );
            didApprove.TakingTime.Morning.approvDate = dateT.addDays(
                didApprove.TakingTime.Morning.approvDate,
                1
            );
        } else if (
            didApprove.TakingTime.Noon.time != "" &&
            didApprove.TakingTime.Noon.status == "send"
        ) {
            MedicneUserService.updateApproveDate(
                didApprove,
                MedicneUserService.checkAlertTime(didApprove, date),
                "send"
            );
            didApprove.TakingTime.Noon.approvDate = dateT.addDays(
                didApprove.TakingTime.Noon.approvDate,
                1
            );
        } else if (
            didApprove.TakingTime.Evening.time != "" &&
            didApprove.TakingTime.Evening.status == "send"
        ) {
            MedicneUserService.updateApproveDate(
                didApprove,
                MedicneUserService.checkAlertTime(didApprove, date),
                "send"
            );
            didApprove.TakingTime.Evening.approvDate = dateT.addDays(
                didApprove.TakingTime.Evening.approvDate,
                1
            );
        }
        let durationUpdate = await MedicneUserService.updateTheDurationOfMed(
            didApprove
        );
        if (durationUpdate) {
            didApprove.ForHowLong += 1;
            didApprove.expandDateNo += 1;
        }
        await MedicneUserService.updateMedApprove(user, didApprove);
        email.missTaking(req.user.email);
    } else {
        res.status(401);
    }
});
//add
router.get("/approved", auth, async(req, res) => {
    let user = await userService.findUserId(req.user.email);
    let updateMed;
    didApprove = await MedicneUserService.approvDate(didApprove);
    if (didApprove) {
        let durationUpdate = await MedicneUserService.updateTheDurationOfMed(
            didApprove
        );
        if (durationUpdate) {
            if (didApprove.ForHowLong >= 0) {
                didApprove.ForHowLong -= 1;
                if (didApprove.ForHowLong <= 3) {
                    email.medRunOut(user);
                }
            }
        }
        updateMed = await MedicneUserService.updateMedApprove(user, didApprove);
    }
    // }
    if (updateMed) {
        res.send(updateMed);
    } else res.status(401);
});

module.exports = router;