const { Stock } = require('./StockSchema.js');

async function createStock(stockSymbol, like, ip) {
    //console.log(`createStock(stockSymbol: ${stockSymbol}, like: ${like}`);
    const stock = new Stock({
        symbol: stockSymbol,
        likes: (like === true || like === "true") ? [ip] : []
    });
    return await stock.save();
}

async function findStock(stockSymbol) {
    const foundStock = await Stock.findOne({ symbol: stockSymbol }).exec();
    //console.log(`findStock(${stockSymbol}) = ${foundStock}`);
    return foundStock;
}

async function saveStock(stockSymbol, like, ip) {
    const foundStock = await findStock(stockSymbol);
    if (!foundStock) {
        return await createStock(stockSymbol, like, ip);
    }
    if (like && foundStock.likes.indexOf(ip) === -1) {
        foundStock.likes.push(ip);
    }
    return foundStock.save();
}

exports.createStock = createStock;
exports.findStock = findStock;
exports.saveStock = saveStock;