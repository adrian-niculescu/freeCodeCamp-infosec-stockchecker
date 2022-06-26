const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

// Requirements
// as per https://www.freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker
//
// Viewing one stock: GET request to /api/stock-prices/
// Viewing one stock and liking it: GET request to /api/stock-prices/
// Viewing the same stock and liking it again: GET request to /api/stock-prices/
// Viewing two stocks: GET request to /api/stock-prices/
// Viewing two stocks and liking them: GET request to /api/stock-prices/


chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
        const symbol = 'GOOG';
        chai
            .request(server)
            .get('/api/stock-prices/')
            .set('Content-Type', 'application/json')
            .query({ stock: symbol })
            .end(function(err, res) {
                assert.notExists(err, 'err should be null or undefined');
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.equal(stockData.stock, symbol);
                assert.exists(stockData.price, `${symbol} should have a price`);
                done();
            });
    });
    
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
        const symbol = 'MSFT';
        chai
            .request(server)
            .get('/api/stock-prices/')
            .set('Content-Type', 'application/json')
            .query({ stock: symbol, like: true })
            .end(function(err, res) {
                assert.notExists(err, 'err should be null or undefined');
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.equal(stockData.stock, symbol);
                assert.exists(stockData.price, `${symbol} should have a price`);
                assert.isAtLeast(stockData.likes, 1, 'Likes should be at least 1')
                done();
            });
    });
    
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
        const symbol = 'MSFT';
        chai
            .request(server)
            .get('/api/stock-prices/')
            .set('Content-Type', 'application/json')
            .query({ stock: symbol, like: true })
            .end(function(err, res) {
                assert.notExists(err, 'err should be null or undefined');
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.equal(stockData.stock, symbol);
                assert.exists(stockData.price, `${symbol} should have a price`);
                assert.isAtLeast(stockData.likes, 1, 'Likes should be at least 1');
                // Do the same again
                chai
                    .request(server)
                    .get('/api/stock-prices/')
                    .set('Content-Type', 'application/json')
                    .query({ stock: symbol, like: true })
                    .end(function(err, res) {
                        assert.notExists(err, 'err should be null or undefined');
                        assert.equal(res.status, 200);
                        const stockData = res.body.stockData;
                        assert.equal(stockData.stock, symbol);
                        assert.exists(stockData.price, `${symbol} should have a price`);
                        assert.isAtLeast(stockData.likes, 1, 'Likes should be at least 1')
                        done();
                    });
            });
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        const symbols = ['GOOG', 'AAPL'];
        chai
            .request(server)
            .get('/api/stock-prices/')
            .set('Content-Type', 'application/json')
            .query({ stock: symbols })
            .end(function(err, res) {
                assert.notExists(err, 'err should be null or undefined');
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                for (let i = 0; i < symbols.length; i++) {
                    assert.equal(stockData[i].stock, symbols[i]);
                    assert.exists(stockData[i].price, `${symbols[i]} should have a price`);
                }
                done();
            });
    });

        test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
        const symbols = ['MSFT', 'AAPL'];
        chai
            .request(server)
            .get('/api/stock-prices/')
            .set('Content-Type', 'application/json')
            .query({ stock: symbols, like: true })
            .end(function(err, res) {
                assert.notExists(err, 'err should be null or undefined');
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                for (let i = 0; i < symbols.length; i++) {
                    assert.equal(stockData[i].stock, symbols[i]);
                    assert.exists(stockData[i].price, `${symbols[i]} should have a price`);
                    assert.exists(stockData[i].rel_likes, 'Should have rel_likes');
                }
                done();
            });
    });

    
});
