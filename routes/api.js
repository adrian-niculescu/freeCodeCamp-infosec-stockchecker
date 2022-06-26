'use strict';

const { getStock } = require('../models/api-operations.js');
const { saveStock } = require("../models/db-operations.js");

module.exports = function(app) {

    app.route('/api/stock-prices').get(async function (req, res) {
        const { stock, like } = req.query;
        console.log(`User GET sock: ${stock}, like: ${like}`);
        const { symbol, latestPrice } = await getStock(stock);
        if (!symbol) {
            console.log(`No symbol found`);
            res.json({ stockData: { likes: like ? 1 : 0 } });
            return;
        }
        const stockData = await saveStock(symbol, like, req.ip);
        console.log(`Stock Data: ${stockData}`);
        res.json(
            {
                stockData: {
                    stock: symbol,
                    price: latestPrice,
                    likes: stockData.likes.length
                }
            }
        );
    });
};
