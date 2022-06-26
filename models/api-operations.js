const fetch = require('node-fetch');
const { saveStock } = require("./db-operations.js");

const BASE_URL = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock';

async function fetchStock(stockSymbol) {
    const url = `${BASE_URL}/${stockSymbol}/quote`;
    const response = await fetch(url);
    const { symbol, latestPrice } = await response.json();
    console.log(`Fetched stock: ${symbol}, ${latestPrice}`);
    return { symbol, latestPrice };
}

async function processGetStockPricesRequest(stockOrStocks, like, ip) {
    console.log(`processGetStockPricesRequest - stock: ${stockOrStocks}, like: ${like}`);
    if (Array.isArray(stockOrStocks)) {
        const { symbol: symbol1, latestPrice: latestPrice1 } = await fetchStock(stockOrStocks[0]);
        const { symbol: symbol2, latestPrice: latestPrice2 } = await fetchStock(stockOrStocks[1]);

        const firstStock = await saveStock(stockOrStocks[0], like, ip);
        const secondStock = await saveStock(stockOrStocks[1], like, ip);

        let stockData = [];
        if (!symbol1) {
            stockData.push({
                rel_likes: firstStock.likes.length - secondStock.likes.length
            });
        } else {
            stockData.push({
                stock: symbol1,
                price: latestPrice1,
                rel_likes: firstStock.likes.length - secondStock.likes.length
            });
        }

        if (!symbol2) {
            stockData.push({
                rel_likes: secondStock.likes.length - firstStock.likes.length
            });
        } else {
            stockData.push({
                stock: symbol2,
                price: latestPrice2,
                rel_likes: secondStock.likes.length - firstStock.likes.length
            });
        }
        return { stockData };
    }
    const { symbol, latestPrice } = await fetchStock(stockOrStocks);
    if (!symbol) {
        return { stockData: { likes: like ? 1 : 0 } };
    }
    const stockData = await saveStock(symbol, like, ip);
    return {
        stockData: {
            stock: symbol,
            price: latestPrice,
            likes: stockData.likes.length
        }
    };
}

exports.fetchStock = fetchStock;
exports.processGetStockPricesRequest = processGetStockPricesRequest;