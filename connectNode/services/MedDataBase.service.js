//add
const Medicne = require("../models/Medicne.model");
class MedicneDatabaseService {
    //add
    findMed = async(med) => {
        let medExist = await Medicne.findOne({
            nameMed: med.MedicneName,
        });
        return medExist;
    };
    //add
    addMedicne = async(newMedicne) => {
        let addMedicne;
        let medExist = await Medicne.findOne({
            nameMed: newMedicne.MedicneName,
        });
        if (!medExist) {
            addMedicne = await Medicne.create({
                nameMed: newMedicne.MedicneName,
                MgQuantity: newMedicne.MgQuantity,
                takingRecommend: newMedicne.takingRecommend,
            });
        }
        return addMedicne;
    };
    overTaking = async(med) => {
        let cheeckOverTake = await Medicne.findOne({
            nameMed: med.MedicneName,
            // takingRecommend: {
            "takingRecommend.AmountOfPills": { $lt: med.AmountOfPills },
            // },
        });
        return cheeckOverTake;
    };
    updateMed = async(med) => {
        let result = await this.findMed(med);
        let tempMed = result;
        if (
            med.takingRecommend.AmountOfPills != "" &&
            med.takingRecommend.AmountOfPills != result.takingRecommend.AmountOfPills
        ) {
            tempMed.takingRecommend.AmountOfPills = med.takingRecommend.AmountOfPills;
        }
        if (
            med.takingRecommend.ForHowLong != null &&
            med.takingRecommend.ForHowLong != result.takingRecommend.ForHowLong
        ) {
            tempMed.takingRecommend.ForHowLong = med.takingRecommend.ForHowLong;
        }
        if (med.MgQuantity != "" && med.MgQuantity != result.MgQuantity) {
            tempMed.MgQuantity = med.MgQuantity;
        }
        if (med.MedicneName != "" && med.MedicneName != result.nameMed) {
            tempMed.nameMed = med.nameMed;
        }
        let updateMedicne = await Medicne.updateOne({ nameMed: tempMed.nameMed }, { $set: tempMed });
        return updateMedicne;
    };
}
const MedicnedatabaseService = new MedicneDatabaseService();
module.exports = MedicnedatabaseService;