const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLEGRO_API_URL = "https://api.allegro.pl";

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
        const response = await fetch(url, {
            headers: {
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMDg5MTM2NDIiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczpyZWFkIl0sImFsbGVncm9fYXBpIjp0cnVlLCJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJleHAiOjE3NDA2MDA4NjcsImp0aSI6IjA5NDUyMjQ0LTVjMDktNGU1Zi1hNmI0LWMzNmUyMDNhNGQ2NCIsImNsaWVudF9pZCI6IjRhNjhkMDk0ZDljMjQ3NTRhNzBlNWY4MWVlNWIxMjQxIn0.Nr6IUxkvp2E1--Cf5ixSUVGNWJEEpoArT49jBD3vJI0wymDCe3FEADzBC-EHPKr1rJ1kOWZ9vr_y-hLxqWVcP-zujUFJjYKbJt-TcBDohalrzhikMyxdbgGLcexPEfrIkT_CD-ZvlJIz66cztWK3jZNB7IDPOWitOH-4apu4AXVI1UaWXc4VmD17Fh2N6LztZQwvbn15YYk4JtkGyx2JjebMMJlmaUSZo0mkA-Ra3u1qYmPfQb8qpOa_XvrGYsosH-PUIjWJlHfPOuJpbJcr19V4okt8Rm0pCvbvINkUN_u5hqnNm4Ydjggc-zXyq5L_q6uTg6hXK-NdZIBeBeHJBw",
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
