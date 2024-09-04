const clickHouseClient = require("../db/clickhousedb");
const tokenService = require("./tokenService");
const { formatDateForClickHouse,addMonthsToDate  } = require("../utils/dateUtils");

exports.generateLicenseService = async (domain, startDate) => {
    let client = await clickHouseClient.initClickHouseClient();

    const licenseCheckResult = await checkAndUpdateLicenses(client, domain);
    if (!licenseCheckResult.valid) {
        return licenseCheckResult;
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const token = tokenService.generateToken(domain, process.env.SECRET_KEY);
    const data = {
        DOMAIN: domain,
        TOKEN: token,
        START_DATE: formatDateForClickHouse(startDate),
        END_DATE: formatDateForClickHouse(endDate),
        ACTIVE: true,
    };

    await insertLicenseData(client, data);
    return { valid: true, licenseCode: token };
};

exports.validateLicenseService = async (domain, token) => {
    let client = await clickHouseClient.initClickHouseClient();
    const currentDate = formatDateForClickHouse(new Date());

    const tokenIsValid = tokenService.validateToken(domain, process.env.SECRET_KEY, token);
    if (!tokenIsValid) {
        return { valid: false, message: "Invalid License" };
    }

    const licenseCheckResult = await isLicenseValid(client, domain, token, currentDate);
    if (!licenseCheckResult.valid) {
        return licenseCheckResult;
    }

    return { valid: true, message: "License is valid and active" };
};

exports.updateExpiredLicensesService = async (domain) => {
    let client = await clickHouseClient.initClickHouseClient();
    try {
        // Query to get the license for the domain
        const query = `SELECT * FROM LICENSE WHERE DOMAIN = '${domain}'`;
        const licenseQuery = await client.query({ query, format: "JSONEachRow" });
        const licenses = await licenseQuery.json();

        if (licenses.length === 0) {
         
            return { valid: false, message: "License not found" };
        }

        const license = licenses[0];
        const endDate = new Date(license.END_DATE);

        // Update the END_DATE to 1 month later
        endDate.setMonth(endDate.getMonth() + 1);
        const endDateFormatted = formatDateForClickHouse(endDate);

        // Update the license in the database
        const updateQuery = `
            ALTER TABLE LICENSE UPDATE END_DATE = '${endDateFormatted}', ACTIVE = true 
            WHERE DOMAIN = '${domain}' AND TOKEN = '${license.TOKEN}'
        `;
        await client.query({ query: updateQuery, format: "JSONEachRow" });
        return { valid: true, message:  `License end date updated to ${endDateFormatted}` };
     
    } catch (error) {
        console.error("Error updating license end date:", error);
    
        return { valid: false, message:  "Internal Server Error",};
    }
};

// Helper functions
const checkAndUpdateLicenses = async (client, domain) => {
    const query = `SELECT * FROM LICENSE WHERE DOMAIN = '${domain}'`;
    const dataset = await client.query({ query, format: "JSONEachRow" }).then(res => res.json());

    if (dataset.length > 0) {
        const currentDate = formatDateForClickHouse(new Date());
        const expiredLicenses = dataset.filter(record => record.END_DATE <= currentDate);

        if (expiredLicenses.length > 0) {
            await client.query({
                query: `ALTER TABLE LICENSE UPDATE ACTIVE = False WHERE DOMAIN = '${domain}'`,
                format: "JSONEachRow",
            });
            console.log("Successfully updated expired licenses");
            return { valid: false, message: "License expired for this Domain" };
        } else {
            return { valid: false, message: "License already exists for this Domain" };
        }
    }

    return { valid: true };
};

const insertLicenseData = async (client, data) => {
    await client.insert({
        table: "LICENSE",
        values: data,
        format: "JSONEachRow",
    });
    console.log("Successfully inserted data into LICENSE table");
};

const isLicenseValid = async (client, domain, token, currentDate) => {
    const query = `SELECT * FROM LICENSE WHERE DOMAIN = '${domain}' AND TOKEN = '${token}'`;
    const licenses = await client.query({ query, format: "JSONEachRow" }).then(res => res.json());

    if (licenses.length === 0) {
        return { valid: false, message: "License not found" };
    }

    const license = licenses[0];
    const startDate = license.START_DATE;
    const endDate = license.END_DATE;

    if (currentDate >= startDate && currentDate <= endDate && license.ACTIVE) {
        return { valid: true };
    }

    return { valid: false, message: "License is expired or inactive" };
};
