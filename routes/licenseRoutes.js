const express = require("express");
const router = express.Router();
const licenseController = require("../controllers/licenseController");


router.post("/generateLicense", licenseController.generateLicense);
router.post("/validateLicense",  licenseController.validateLicense);
router.post("/expiredlicensedatechange", licenseController.expiredLicensedatechange);
module.exports = router;
