const axios = require('axios');
const fs = require('fs');

const API_KEY = 'WOHUGE1V9FV9LK5V';

// Generic function to fetch and combine data
const fetchData = async (urls, fileName, dataKey) => {
    // Check if the file already exists and has valid data
    if (fs.existsSync(fileName)) {
        const existingData = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        if (existingData && Object.keys(existingData).length > 0 && !isRateLimitMessage(existingData)) {
            console.log(`Using cached data from ${fileName}`);
            return;
        }
    }

    console.log(`Fetching data for ${dataKey}...`);
    const combinedData = {};
    for (const [key, url] of Object.entries(urls)) {
        try {
            const response = await axios.get(url);
            if (isValidResponse(response.data)) {
                combinedData[key] = response.data;
            } else {
                console.warn(`Invalid response for ${key}. Skipping.`);
            }
        } catch (error) {
            console.error(`Error fetching ${key}:`, error.message);
        }
    }

    if (Object.keys(combinedData).length > 0) {
        fs.writeFileSync(fileName, JSON.stringify(combinedData, null, 2));
        console.log(`${dataKey} data saved to ${fileName}`);
    } else {
        console.warn(`No valid data for ${dataKey}. Nothing was saved.`);
    }
};

// Validate the API response
const isValidResponse = (data) => {
    return !data.Information; // If there's no "Information" key, the response is valid
};

// Check if the cached data contains a rate limit message
const isRateLimitMessage = (data) => {
    return data.Information && data.Information.includes('rate limit');
};

// Fetch all data
const fetchAllData = async () => {
    // Stock URLs
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    const stockUrls = stockSymbols.reduce((acc, symbol) => {
        acc[symbol] = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
        return acc;
    }, {});

    // Commodity URLs
    const commoditySymbols = ['WTI', 'BRENT', 'NATURAL_GAS', 'COPPER', 'COFFEE'];
    const commodityUrls = commoditySymbols.reduce((acc, symbol) => {
        acc[symbol] = `https://www.alphavantage.co/query?function=${symbol}&interval=monthly&apikey=${API_KEY}`;
        return acc;
    }, {});

    // News URL
    const newsUrl = {
        news: `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}`,
    };

    // Fetch and save data
    await fetchData(stockUrls, 'stocks.json', 'Stocks');
    await fetchData(commodityUrls, 'commodities.json', 'Commodities');
    await fetchData(newsUrl, 'news.json', 'News');
};

// Execute the fetch process
fetchAllData();
