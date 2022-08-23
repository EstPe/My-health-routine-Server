const express = require("express");
const auth = require("../middlewares/auth.middleware");
const Pharmacy = require("../models/pharmacy.model");
const pharmacyService = require("../services/pharmacy.service");

const router = express.Router();

router.post("/pharmacy", auth, async(req, res) => {
    console.log(req.body);
    let getPharmacyByCitiy = await pharmacyService.getPharmacyByCitiy(req.body);
    if (getPharmacyByCitiy) res.send(getPharmacyByCitiy);
    else {
        res.status(401);
    }
});
router.get("/pharmacies", async(req, res) => {
    let pharmacyDetails = await Pharmacy.find({});
    res.send(pharmacyDetails);
});
router.post("/addPharmacy", auth, async(req, res) => {
    let pharmacy = {
        namePharmacy: req.body.namePharmacy,
        address: {
            citiy: req.body.citiy,
            street: req.body.street,
            numberStreet: req.body.numberStreet,
        },
        phone: req.body.phone,
        openingDescription: req.body.openingDescription,
    };
    let exsit = await pharmacyService.pharmacyExist(pharmacy);
    if (exsit) {
        res.status(401).json({
            message: "Pharmacy alredy exsit!",
        });
    } else {
        result = await pharmacyService.addPharmacy(pharmacy);
        res.send(result);
    }
});

module.exports = router;