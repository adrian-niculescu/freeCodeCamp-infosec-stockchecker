'use strict';

const { processGetStockPricesRequest } = require('../models/api-operations.js');

module.exports = function(app) {

    app.route('/api/stock-prices').get(async function(req, res) {
        let { stock, like } = req.query;
        like = (like === true || like === 'true');
        const ip = req.ip;
        const response = await processGetStockPricesRequest(stock, like, ip);
        res.json(response);
    });
};
