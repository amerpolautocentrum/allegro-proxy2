import { NextResponse } from 'next/server';

const ALLEGRO_API_URL = "https://api.allegro.pl";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") || '0';
        const limit = searchParams.get("limit") || '6';
        const sort = searchParams.get("sort") || '-publication.start';
        const brand = searchParams.get("brand");
        const model = searchParams.get("model");
        const yearFrom = searchParams.get("yearFrom");
        const yearTo = searchParams.get("yearTo");
        const priceMin = searchParams.get("priceMin");
        const priceMax = searchParams.get("priceMax");

        let url = `${ALLEGRO_API_URL}/sale/offers?offset=${offset}&limit=${limit}&sort=${sort}`;
        if (brand) url += `&phrase=${encodeURIComponent(brand)}`;
        if (model) url += `&phrase=${encodeURIComponent(`${brand || ''} ${model}`)}`;
        if (yearFrom) url += `¶meter.15326=${yearFrom}`;
        if (yearTo) url += `¶meter.15326=${yearTo}`;
        if (priceMin) url += `&price.from=${priceMin}`;
        if (priceMax) url += `&price.to=${priceMax}`;

        console.log("Fetching URL:", url); // Debug

        const response = await fetch(url, {
            headers: {
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMDg5MTM2NDIiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczpyZWFkIl0sImFsbGVncm9fYXBpIjp0cnVlLCJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJleHAiOjE3NDA0NzEzMTksImp0aSI6IjAwYzQzZmJhLWVlYjUtNGQ3Yi1hMDc4LTQ4ZTgzY2MwODdkNCIsImNsaWVudF9iZCI6IjRhNjhkMDk0ZDljMjQ3NTRhNzBlNWY4MWVlNWIxMjQxIn0.zIuDmtfq7o-WXbMqQcQwYVOpcZ3WBrAh8HSf3OTNuP5gpp13METrCZu9mhaoUmu0oIeLM-jPKKHnvD2h85zNdcPAv6KV0xLKD-ZNY2jp61Oi0-VJYLveHoJjnC4lkm0QYmuRL1PVvtTSFCIf3fWCYvopjy2vCsXV_tyvbdMpVsawfLtW2cA6PqZPRnj7F4YFYtKq3S3trydz4e9uLT2UCXN3UT_njrEoEzwJBotnw1pYV2f1VDJS5RuPD1kGhAh3jG3FrHN1Vf1o4CyRM9zpl_KbBH3cMRpin2beYaN58qqy59YQa0uQC_InNvj3fAXN2tDw-dhKr0j4bGfxbDrO9g",
                "Accept": "application/vnd.allegro.public.v1+json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        console.log("Response status:", response.status); // Debug
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Response data:", data); // Debug
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
