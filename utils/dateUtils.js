exports.formatDateForClickHouse = (date) => {
    return date.toISOString().split("T")[0];
};


exports.addMonthsToDate = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};