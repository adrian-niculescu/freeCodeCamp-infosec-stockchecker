const crypto = require('crypto');

async function anonymizeIp(ip) {
    const hash = crypto.createHash('sha256')
        .update(ip)
        .digest('hex');
    return hash;
}

exports.anonymizeIp = anonymizeIp;