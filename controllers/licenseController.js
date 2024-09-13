const {validateLicenseService , updateExpiredLicensesService ,generateLicenseService} = require("../services/licenseService");
const tokenService = require("../services/tokenService");
const { validateInput } = require("../services/validationService");
// Main function to generate license
exports.generateLicense = async (req, res) => {
    const { domain, startingTime } = req.body;

    // Validate input
    const validationResult = validateInput(domain, startingTime);
    if (!validationResult.valid) {
        return res.status(400).json(validationResult);
    }

    try {
        const result = await generateLicenseService(domain, validationResult.startDate);
        return res.json(result);
    } catch (error) {
        console.error("License generation error:", error);
        return res.status(500).json({
            valid: false,
            message: "Internal Server Error",
        });
    }
};

// Main function to validate license
exports.validateLicense = async (req, res) => {
    const { domain, token } = req.body;

    if (!domain || !token) {
        return res.status(400).json({
            valid: false,
            message: "Domain and token are required",
        });
    }

    try {
        const result = await validateLicenseService(domain, token);
        return res.json(result);
    } catch (error) {
        console.error("License validation error:", error);
        return res.status(500).json({
            valid: false,
            message: "Internal Server Error",
        });
    }
};

// Main function to expired License Date Change
exports.expiredLicensedatechange = async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            valid: false,
            message: "Domain is required",
        });
    }

    try {
        const result = await updateExpiredLicensesService(domain);
        return res.json(result);
    } catch (error) {
        console.error("Error updating expired licenses:", error);
        return res.status(500).json({
            valid: false,
            message: "Internal Server Error",
        });
    }
};
