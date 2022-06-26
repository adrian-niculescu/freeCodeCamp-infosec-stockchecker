const { Stock } = require('./StockSchema.js');
const { anonymizeIp } = require('./ip.js');

async function createStock(stockSymbol, like, ip) {
    const stock = new Stock({
        symbol: stockSymbol,
        likes: like ? [ip] : []
    });
    return await stock.save();
}

async function findStock(stockSymbol) {
    const foundStock = await Stock.findOne({ symbol: stockSymbol }).exec();
    return foundStock;
}

async function saveStock(stockSymbol, like, ip) {
    /* Due to privacy considerations, do not
     * save the IP address in the DB.
     * We can hash the data for our purposes.
     */
    const anonymizedIp = await anonymizeIp(ip);
    const foundStock = await findStock(stockSymbol);
    if (!foundStock) {
        return await createStock(stockSymbol, like, anonymizedIp);
    }
    if (like && foundStock.likes.indexOf(anonymizedIp) === -1) {
        foundStock.likes.push(anonymizedIp);
    }
    return foundStock.save();
}

exports.createStock = createStock;
exports.findStock = findStock;
exports.saveStock = saveStock;