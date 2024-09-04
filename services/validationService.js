exports.validateInput = (domain, startingTime) => {
    if (!domain || !startingTime) {
        return { valid: false, message: "Domain and startingTime are required" };
    }

    const startDate = new Date(startingTime);
    if (isNaN(startDate.getTime())) {
        return { valid: false, message: "Invalid startingTime format" };
    }
    return { valid: true, startDate };
};
