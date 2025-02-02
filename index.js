const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Utility function to load JSON data
const loadJSON = (fileName) => {
    try {
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error.message);
        return null; // Return null if there’s an issue
    }
};

// Routes
app.get('/stocks', (req, res) => {
    const stockData = loadJSON('stocks.json');
    if (stockData) {
        res.json(stockData);
    } else {
        res.status(500).json({ error: 'Failed to load stocks data' });
    }
});

app.get('/stocks/:symbol', (req, res) => {
    const stockData = loadJSON('stocks.json');
    const symbol = req.params.symbol.toUpperCase();
    if (stockData && stockData[symbol]) {
        res.json(stockData[symbol]);
    } else {
        res.status(404).json({ error: `Stock ${symbol} not found` });
    }
});

app.get('/commodities', (req, res) => {
    const commodityData = loadJSON('commodities.json');
    if (commodityData) {
        res.json(commodityData);
    } else {
        res.status(500).json({ error: 'Failed to load commodities data' });
    }
});

app.get('/commodities/:symbol', (req, res) => {
    const commodityData = loadJSON('commodities.json');
    const symbol = req.params.symbol.toUpperCase();
    if (commodityData && commodityData[symbol]) {
        res.json(commodityData[symbol]);
    } else {
        res.status(404).json({ error: `Commodity ${symbol} not found` });
    }
});

app.get('/news', (req, res) => {
    const newsData = loadJSON('news.json');
    if (newsData) {
        res.json(newsData);
    } else {
        res.status(500).json({ error: 'Failed to load news data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});