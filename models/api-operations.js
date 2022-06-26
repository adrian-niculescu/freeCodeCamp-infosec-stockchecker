const fetch = require('node-fetch');
const BASE_URL = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock';

async function getStock(stockSymbol) {
    const url = `${BASE_URL}/${stockSymbol}/quote`;
    console.log(`Will fetch from url: ${url}`);
    const response = await fetch(url);
    const { symbol, latestPrice } = await response.json();
    console.log(`Fetched stock: ${symbol}, ${latestPrice}`);
    return { symbol, latestPrice };
}

exports.getStock = getStock;