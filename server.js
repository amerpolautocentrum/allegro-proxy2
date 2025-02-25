const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLEGRO_API_URL = "https://api.allegro.pl";

// Middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Funkcja retry z opóźnieniem
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { ...options, timeout: 10000 });
            return response;
        } catch (error) {
            if (i === retries - 1) throw error; // Ostatnia próba – rzucamy błąd
            console.log(`Próba ${i + 1} nieudana: ${error.message}. Czekam ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

app.get('/api/proxy', async (req, res) => {
    console.log("Proxy endpoint invoked");
    const { offset = '0', limit = '6', sort = '-publication.start', brand, model, yearFrom, yearTo, priceMin, priceMax } = req.query;

    let url = `${ALLEGRO_API_URL}/sale/offers?offset=${offset}&limit=${limit}&sort=${sort}`;
    if (brand) url += `&phrase=${encodeURIComponent(brand)}`;
    if (model) url += `&phrase=${encodeURIComponent(`${brand || ''} ${model}`)}`;
    if (yearFrom) url += `¶meter.15326=${yearFrom}`;
    if (yearTo) url += `¶meter.15326=${yearTo}`;
    if (priceMin) url += `&price.from=${priceMin}`;
    if (priceMax) url += `&price.to=${priceMax}`;

    console.log("Fetching URL:", url);

    try {
        const response = await fetchWithRetry(url, {
            headers: {
                "Authorization": "Bearer TWÓJ_NOWY_TOKEN", // Wstaw nowy token tutaj
                "Accept": "application/vnd.allegro.public.v1+json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        const status = response.status;
        const text = await response.text();
        console.log("Response status:", status);
        console.log("Response text:", text);

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${status} - ${text}`);
        }

        const data = JSON.parse(text);
        console.log("Response data:", data);
        res.json(data);
    } catch (error) {
        console.error("Proxy error:", error.message);
        res.status(500).json({ error: error.message, details: error.stack });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
