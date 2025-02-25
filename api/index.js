const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const url = `https://api.allegro.pl/sale/offers${req.url}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMDg5MTM2NDIiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczpyZWFkIl0sImFsbGVncm9fYXBpIjp0cnVlLCJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJleHAiOjE3NDA0NzEzMTksImp0aSI6IjAwYzQzZmJhLWVlYjUtNGQ3Yi1hMDc4LTQ4ZTgzY2MwODdkNCIsImNsaWVudF9pZCI6IjRhNjhkMDk0ZDljMjQ3NTRhNzBlNWY4MWVlNWIxMjQxIn0.zIuDmtfq7o-WXbMqQcQwYVOpcZ3WBrAh8HSf3OTNuP5gpp13METrCZu9mhaoUmu0oIeLM-jPKKHnvD2h85zNdcPAv6KV0xLKD-ZNY2jp61Oi0-VJYLveHoJjnC4lkm0QYmuRL1PVvtTSFCIf3fWCYvopjy2vCsXV_tyvbdMpVsawfLtW2cA6PqZPRnj7F4YFYtKq3S3trydz4e9uLT2UCXN3UT_njrEoEzwJBotnw1pYV2f1VDJS5RuPD1kGhAh3jG3FrHN1Vf1o4CyRM9zpl_KbBH3cMRpin2beYaN58qqy59YQa0uQC_InNvj3fAXN2tDw-dhKr0j4bGfxbDrO9g",
                "Accept": "application/vnd.allegro.public.v1+json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
