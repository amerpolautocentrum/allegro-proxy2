const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLEGRO_API_URL = "https://api.allegro.pl";

// Dodajemy middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Pozwala na dostęp z dowolnej domeny
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
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMDg5MTM2NDIiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczpyZWFkIl0sImFsbGVncm9fYXBpIjp0cnVlLCJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJleHAiOjE3NDA1NDE2MjYsImp0aSI6IjhjMDNlNmE4LWIyNzMtNGM1Ni05ODEzLTE3ZGQ5OWUwYWVmYiIsImNsaWVudF9pZCI6IjRhNjhkMDk0ZDljMjQ3NTRhNzBlNWY4MWVlNWIxMjQxIn0.MpfMd5YKaliCszHxxEC0z_16Z5IljmF1DQNaLfGOUkfvoRMjf2hCz-OCQgT48EAPZwTrU9BBqsh2ycwOh7nYyoCXDxy7wNoeM9vwJjHyMIk99_Z3ZS7AHjcTd5Rk7wHOC7ViAVvuqk4kOegLQRwt9BRi8Hh7KlWgKw3L9LGLfQT7MkMUzE2vhsS1YpuoInbY3Tq6U22GsdFcyWsWiZ4opX14M3s0yCX2BIn85LUd3zdl4ZT51L1VpRMvRdYjPrhCV1Ybq6mvP3g7jDVq-lgZyUvAV9wVnnV_bZ9XJPWdcsu_69AvR8Q_K02sKfbQk-fqFH2V0q7DZyu0ie3ySNGMLQ",
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
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
