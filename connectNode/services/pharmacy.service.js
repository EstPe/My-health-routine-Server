const Pharmacy = require("../models/pharmacy.model");
class PharmacyService {
    //add
    getPharmacyByCitiy = async(pharmacy) => {
        let pharmacyDetails = await Pharmacy.find({
            $or: [
                { "address.citiy": pharmacy.searchCity },
                { namePharmacy: pharmacy.searchCity },
                { "address.street": pharmacy.searchCity },
            ],
        });
        if (pharmacyDetails) {
            return pharmacyDetails;
        }
        return null;
    };

    addPharmacy = async(pharmacy) => {
        let newPharmacy = await Pharmacy.create({
            namePharmacy: pharmacy.namePharmacy,
            address: {
                citiy: pharmacy.citiy,
                street: pharmacy.street,
                numberStreet: pharmacy.numberStreet,
            },
            phone: pharmacy.phone,
            openingDescription: pharmacy.openingDescription,
        });

        return newPharmacy;
    };
    pharmacyExist = async(pharmacy) => {
        let Exist = await Pharmacy.findOne({
            $or: [
                { namePharmacy: pharmacy.namePharmacy },
                { address: { street: pharmacy.street } },
            ],
        });
        if (Exist) {
            return true;
        }
        return false;
    };
}
const pharmacyService = new PharmacyService();
module.exports = pharmacyService;