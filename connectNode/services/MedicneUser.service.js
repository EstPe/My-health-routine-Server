const MedicneUser = require("../models/MedicneUser.model");
const userService = require("../services/user.service");
const Medicne = require("../models/Medicne.model");
const MedicneService = require("../services/MedDataBase.service");
const dateT = require("date-and-time");

class MedicneUserService {
    addMedicneUser = async(Medicne) => {
        let newUserMedicne = await MedicneUser.create({
            userId: Medicne.userId,
            MedicneName: Medicne.MedicneName,
            MgQuantity: Medicne.MgQuantity,
            TakingTime: Medicne.TakingTime,
            AmountOfPills: Medicne.AmountOfPills,
            ForHowLong: Medicne.ForHowLong,
            StartDay: Medicne.StartDay,
            didApprove: Medicne.didApprove,
        });
        await MedicneService.addMedicne(newUserMedicne);
        return newUserMedicne;
    };

    getMedicneUser = async(UserMedicne) => {
        let Usermedicne = await MedicneUser.find({
            userId: UserMedicne.userId,
            // $or: [{
            $expr: {
                $eq: [
                    { $month: "$StartDay" },
                    new Date(UserMedicne.monthYear).getMonth() + 1,
                ],
                // $eq: [{ $year: "$StartDay" }, new Date().getFullYear()],
            },
            // }, ],
            // $expr: {
            //     $eq: [{ $year: "$StartDay" }, new Date().getFullYear()],
            // },
        });

        return Usermedicne;
    };
    onlyOneInMonth = async(UserMedicne) => {
        let Usermedicne = await MedicneUser.find({
            userId: UserMedicne.userId,
            $expr: {
                $eq: [
                    { $month: "$StartDay" },
                    new Date(UserMedicne.StartDay).getMonth() + 1,
                ],
            },
            MedicneName: UserMedicne.MedicneName,
        });

        return Usermedicne;
    };
    //add
    //   getMedicneUserById = async (UserMedicne) => {
    //     let Usermedicne = await MedicneUser.findOne({ _id: UserMedicne._id });
    //     return Usermedicne;
    //   };
    findMedUser = async(user) => {
        let findMedUser = await MedicneUser.find({ userId: user._id });

        return findMedUser;
    };
    updateMedUser = async(MedUser) => {
        let result = await this.getMedicneUserById(MedUser);
        // for (let i = 0; i < result.length; i++) {
        let medUser = result;
        if (
            MedUser.MedicneName != "" &&
            MedUser.MedicneName != result.MedicneName
        ) {
            medUser.MedicneName = MedUser.MedicneName;
        }

        if (MedUser.MgQuantity != "" && MedUser.MgQuantity != result.MgQuantity) {
            medUser.MgQuantity = MedUser.MgQuantity;
        }
        if (
            MedUser.TakingTime.Morning.time != "" &&
            MedUser.TakingTime.Noon.time != "" &&
            MedUser.TakingTime.Evening.time != "" &&
            MedUser.TakingTime != result.TakingTime
        ) {
            medUser.TakingTime = MedUser.TakingTime;
            medUser.TakingTime.Morning.approvDate = MedUser.TakingTime.Morning.date;
            medUser.TakingTime.Noon.approvDate = MedUser.TakingTime.Noon.date;
            medUser.TakingTime.Evening.approvDate = MedUser.TakingTime.Evening.date;
        }
        if (
            MedUser.AmountOfPills != "" &&
            MedUser.AmountOfPills != result.AmountOfPills
        ) {
            medUser.AmountOfPills = MedUser.AmountOfPills;
        }
        if (MedUser.ForHowLong != "" && MedUser.ForHowLong != result.ForHowLong) {
            medUser.ForHowLong = MedUser.ForHowLong;
        }
        if (MedUser.StartDay != "" && MedUser.StartDay != result.StartDay) {
            medUser.StartDay = MedUser.StartDay;
        }

        // }

        let updateMedicneUser = await MedicneUser.updateOne({ _id: MedUser._id }, { $set: medUser });
        if (updateMedicneUser) return updateMedicneUser;
        return null;
    };
    updateMedApprove = async(user, med) => {
        let updateUser = await MedicneUser.updateOne({ _id: med._id }, { $set: med });
        if (updateUser) return updateUser;
        return false;
    };

    checkAlertTime = (ele, date) => {
        if (
            ele.TakingTime.Morning.approvDate.toISOString().split("T")[0] ==
            new Date().toISOString().split("T")[0] ||
            (ele.TakingTime.Morning.approvDate.getDate() <= date.getDate() &&
                ele.TakingTime.Morning.time != "")
        ) {
            if (
                ele.TakingTime.Morning.alert.substring(0, 2) == new Date().getHours() &&
                ele.TakingTime.Morning.alert.substring(3, 5) ==
                dateT.format(new Date(), "mm")
            ) {
                return "Morning";
            }
        } else if (
            ele.TakingTime.Noon.approvDate.toISOString().split("T")[0] ==
            new Date().toISOString().split("T")[0] ||
            (ele.TakingTime.Noon.approvDate.getDate() <= date.getDate() &&
                ele.TakingTime.Noon.time != "")
        ) {
            if (
                ele.TakingTime.Noon.alert.substring(0, 2) == new Date().getHours() &&
                ele.TakingTime.Noon.alert.substring(3, 5) ==
                dateT.format(new Date(), "mm")
            ) {
                return "Noon";
            }
        }
        if (
            ele.TakingTime.Evening.approvDate.toISOString().split("T")[0] ==
            new Date().toISOString().split("T")[0] ||
            (ele.TakingTime.Evening.approvDate.getDate() <= date.getDate() &&
                ele.TakingTime.Evening.time != "")
        ) {
            if (
                ele.TakingTime.Evening.alert.substring(0, 2) == new Date().getHours() &&
                ele.TakingTime.Evening.alert.substring(3, 5) ==
                dateT.format(new Date(), "mm")
            ) {
                return "Evening";
            }
        }

        return null;
    };
    //add
    updateApproveDate = (medDetails, ele, text) => {
        if (ele == "Morning" && medDetails.TakingTime.Morning.status != text) {
            medDetails.TakingTime.Morning.status = text;
        } else {
            medDetails.TakingTime.Morning.status = "";
        }
        if (ele == "Noon" && medDetails.TakingTime.Noon.status != text) {
            medDetails.TakingTime.Noon.status = text;
        } else {
            medDetails.TakingTime.Noon.status = "";
        }
        if (ele == "Evening" && medDetails.TakingTime.Evening.status != text) {
            medDetails.TakingTime.Evening.status = text;
        } else {
            medDetails.TakingTime.Evening.status = "";
        }
        return medDetails;
    };
    //add
    approvDate = async(med) => {
        if (med != undefined) {
            if (
                med.TakingTime.Morning.time == "Morning" &&
                med.TakingTime.Morning.status == "send"
            ) {
                if (
                    med.TakingTime.Morning.approvDate.getDate() !=
                    new Date(med.StartDay.getDate() + med.ForHowLong - 1).getDate()
                ) {
                    med.TakingTime.Morning.approvDate = dateT.addDays(
                        med.TakingTime.Morning.approvDate,
                        1
                    );
                    return med;
                }
            }
            if (
                med.TakingTime.Noon.time == "Noon" &&
                med.TakingTime.Noon.status == "send"
            ) {
                if (
                    med.TakingTime.Noon.approvDate.getDate() !=
                    new Date(med.StartDay.getDate() + med.ForHowLong - 1).getDate()
                ) {
                    med.TakingTime.Noon.approvDate = dateT.addDays(
                        med.TakingTime.Noon.approvDate,
                        1
                    );
                    return med;
                }
            }
            if (
                med.TakingTime.Evening.time == "Evening" &&
                med.TakingTime.Evening.status == "send"
            ) {
                if (
                    med.TakingTime.Evening.approvDate.getDate() !=
                    new Date(med.StartDay.getDate() + med.ForHowLong - 1).getDate()
                ) {
                    med.TakingTime.Evening.approvDate = dateT.addDays(
                        med.TakingTime.Evening.approvDate,
                        1
                    );
                    return med;
                }
            }
        }
        return false;
    };
    //add
    updateTheDurationOfMed = async(med) => {
        if (
            med.TakingTime.Morning.time == "Morning" &&
            med.TakingTime.Morning.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Noon.time == "Noon" &&
            med.TakingTime.Noon.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Evening.time == "Evening" &&
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0]
        ) {
            return true;
        } else if (
            med.TakingTime.Morning.time == "Morning" &&
            med.TakingTime.Morning.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Noon.time == "Noon" &&
            med.TakingTime.Noon.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0]
        ) {
            if (med.TakingTime.Evening.time == "Evening") return false;
            return true;
        } else if (
            med.TakingTime.Morning.time == "Morning" &&
            med.TakingTime.Morning.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Evening.time == "Evening" &&
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0]
        )
            return true;
        else if (
            med.TakingTime.Noon.time == "Noon" &&
            med.TakingTime.Noon.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Evening.time == "Evening" &&
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0]
        ) {
            return true;
        } else if (
            med.TakingTime.Morning.time == "Morning" &&
            (med.TakingTime.Morning.approvDate.toISOString().split("T")[0] !=
                new Date().toISOString().split("T")[0] ||
                med.TakingTime.Noon.time == "Noon") &&
            (med.TakingTime.Noon.approvDate.toISOString().split("T")[0] !=
                new Date().toISOString().split("T")[0] ||
                med.TakingTime.Evening.time == "Evening") &&
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] !=
            new Date().toISOString().split("T")[0]
        ) {
            return true;
        }
        return false;
    };
    didNotApprov = async(med, user) => {
        let date = new Date();
        let flag = false;

        if (
            med.TakingTime.Morning.approvDate.toISOString().split("T")[0] <
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Morning.approvDate.toISOString().split("T")[0] <=
            new Date(
                date.setDate(
                    med.TakingTime.Morning.approvDate.getDate() + med.ForHowLong
                )
            )
            .toISOString()
            .split("T")[0]
        ) {
            med.TakingTime.Morning.approvDate = dateT.addDays(
                med.TakingTime.Morning.approvDate,
                1
            );
            await this.updateMedApprove(user, med);
            flag = true;
        }
        if (
            med.TakingTime.Noon.approvDate.toISOString().split("T")[0] <
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Noon.approvDate.toISOString().split("T")[0] <=
            new Date(
                date.setDate(
                    med.TakingTime.Noon.approvDate.getDate() + med.ForHowLong
                )
            )
            .toISOString()
            .split("T")[0]
        ) {
            med.TakingTime.Noon.approvDate = dateT.addDays(
                med.TakingTime.Noon.approvDate,
                1
            );
            await this.updateMedApprove(user, med);
            flag = true;
        }
        if (
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] <
            new Date().toISOString().split("T")[0] &&
            med.TakingTime.Evening.approvDate.toISOString().split("T")[0] <=
            new Date(
                date.setDate(
                    med.TakingTime.Evening.approvDate.getDate() + med.ForHowLong
                )
            )
            .toISOString()
            .split("T")[0]
        ) {
            med.TakingTime.Evening.approvDate = dateT.addDays(
                med.TakingTime.Evening.approvDate,
                1
            );
            await this.updateMedApprove(user, med);
            flag = true;
        }
        if (flag) {
            console.log(flag);
            return flag;
        } else {
            console.log(flag);
            return false;
        }
    };
}
const MedicneuserService = new MedicneUserService();
module.exports = MedicneuserService;