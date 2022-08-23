const MedicneUser = require("../models/MedicneUser.model");
const userService = require("../services/user.service");
const Medicne = require("../models/Medicne.model");
const dateT = require("date-and-time");
class MedicneUserService {
    addMedicneUser = async(Medicne) => {
        let newUserMedicne = await MedicneUser.create({
            userId: Medicne.userId,
            MedicneName: Medicne.MedicneName,
            MgQuantity: Medicne.MgQuantity,
            TakingTime: Medicne.TakingTime,
            AmountOfPills: Medicne.AmountOfPills,
            CapletsByHour: Medicne.CapletsByHour,
            StartDay: Medicne.StartDay,
            didApprove: Medicne.didApprove,
        });
        this.addMedicne(newUserMedicne);
        return newUserMedicne;
    };
    addMedicne = async(newMedicne) => {
        let medExist = await Medicne.findOne({
            nameMed: medName,
        });

        if (!medExist) {
            let medName = `${newMedicne.MedicneName} ${newMedicne.MgQuantity}MG`;
            let addMedicne = await Medicne.create({
                nameMed: medName,
                size: newMedicne.MgQuantity,
            });
            if (addMedicne) return true;
        } else return false;
    };
    getMedicneUser = async(UserMedicne) => {
        let Usermedicne = await MedicneUser.find({
            userId: UserMedicne.userId,
            "date.getMonth()": {
                $eq: new Date().getMonth() + 1,
            },
        });
        return Usermedicne;
    };
    //add
    getMedicneUserById = async(UserMedicne) => {
        let Usermedicne = await MedicneUser.findOne({ _id: UserMedicne._id });
        return Usermedicne;
    };
    updateMedUser = async(MedUser, userD) => {
        let user = await userService.findUserId(userD);
        let medUser = {
            userId: user._id,
            MedicneName: MedUser.MedicneName,
            MgQuantity: MedUser.MgQuantity,
            TakingTime: MedUser.TakingTime,
            AmountOfPills: MedUser.AmountOfPills,
            CapletsByHour: MedUser.CapletsByHour,
            StartDay: MedUser.StartDay,
        };

        let result = await this.getMedicneUserById(MedUser);
        // for (let i = 0; i < result.length; i++) {
        medUser = result;
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
        if (
            MedUser.CapletsByHour != "" &&
            MedUser.CapletsByHour != result.CapletsByHour
        ) {
            medUser.CapletsByHour = MedUser.CapletsByHour;
        }
        if (MedUser.StartDay != undefined && MedUser.StartDay != result.StartDay) {
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

    findMedUser = async(user) => {
        let findMedUser = await MedicneUser.find({ userId: user._id });
        return findMedUser;
    };
    checkAlertTime = (ele, date) => {
        if (
            ele.TakingTime.Morning.approvDate.toISOString().split("T")[0] ==
            new Date().toISOString().split("T")[0] ||
            ele.TakingTime.Morning.approvDate.getDate() <= date.getDate()
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
            ele.TakingTime.Noon.approvDate.getDate() <= date.getDate()
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
            ele.TakingTime.Evening.approvDate.getDate() <= date.getDate()
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
        if (ele == "Morning") {
            medDetails.TakingTime.Morning.status = text;
        }
        if (ele == "Noon") {
            medDetails.TakingTime.Noon.status = text;
        }
        if (ele == "Evening") {
            medDetails.TakingTime.Evening.status = text;
        }
        console.log(ele);
        return medDetails;
    };
    //add
    approvDate = (med) => {
        if (
            med.TakingTime.Morning.time == "Morning" &&
            med.TakingTime.Morning.status == "send"
        ) {
            if (
                med.TakingTime.Morning.approvDate.getDate() !=
                new Date(med.StartDay.getDate() + med.CapletsByHour - 1).getDate()
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
                new Date(med.StartDay.getDate() + med.CapletsByHour - 1).getDate()
            ) {
                console.log(med.TakingTime.Noon.approvDate);
                med.TakingTime.Noon.approvDate = dateT.addDays(
                    med.TakingTime.Noon.approvDate,
                    1
                );
                console.log(med.TakingTime.Noon.approvDate);
                return med;
            }
        }
        if (
            med.TakingTime.Evening.time == "Evening" &&
            med.TakingTime.Evening.status == "send"
        ) {
            if (
                med.TakingTime.Evening.approvDate.getDate() !=
                new Date(med.StartDay.getDate() + med.CapletsByHour - 1).getDate()
            ) {
                med.TakingTime.Evening.approvDate = dateT.addDays(
                    med.TakingTime.Evening.approvDate,
                    1
                );
                return med;
            }
        }
        return false;
    };
}
const MedicneuserService = new MedicneUserService();
module.exports = MedicneuserService;