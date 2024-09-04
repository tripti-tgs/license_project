const crypto = require("crypto");

exports.generateToken = (domain, secretKey) => {
    const combinedString = `${domain}:${secretKey}`;
    const hash = crypto.createHash("sha256");
    hash.update(combinedString);
    return hash.digest("hex");
};

exports.validateToken = (domain, secretKey, token) => {
    const expectedToken = this.generateToken(domain, secretKey);
    return expectedToken === token;
};
