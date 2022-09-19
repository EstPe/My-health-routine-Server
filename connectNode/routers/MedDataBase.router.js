const express = require("express");
const auth = require("../middlewares/auth.middleware");
const Medicne = require("../models/Medicne.model");
const MedicneService = require("../services/MedDataBase.service");

const router = express.Router();

//form medicane database
router.post("/addMedcine", auth, async(req, res) => {
    let med = {
        MedicneName: req.body.MedicneName,
        MgQuantity: req.body.MgQuantity,
        takingRecommend: req.body.takingRecommend,
    };
    medExist = await MedicneService.findMed(med);

    if (!medExist) {
        result = await MedicneService.addMedicne(med);
        if (result) {
            res.send(result);
        }
    } else res.status(401).json({ message: "already exist" });
});

router.put("/updateMed/:nameMed", auth, async(req, res) => {
    let updateMedicne = await MedicneService.updateMed(req.body);
    if (updateMedicne) res.send(updateMedicne);
    else res.status(401);
});
router.post("/overTake", auth, async(req, res) => {
    let check = await MedicneService.overTaking(req.body);
    if (!check) res.status(401).json({ message: "med not exist" });
    else res.send(check);
});

router.get("/getMedicnes", auth, async(req, res) => {
    let result = await Medicne.find({});
    if (result) res.send(result);
    else res.status(401);
});

router.delete("/deleteMed/:_id", auth, async(req, res) => {
    console.log(req.params);
    const medExist = await Medicne.findOne({
        _id: req.params._id,
    });
    if (medExist) {
        let deleteMed = await Medicne.deleteOne({
            _id: req.params._id,
        });
        if (deleteMed) res.send(deleteMed);
        else res.status(401);
    } else {
        res.status(401).json({ message: "Medicne did not exist" });
    }
});

module.exports = router;