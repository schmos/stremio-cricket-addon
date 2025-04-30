const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

const logos = {
    bcci: "https://www.bcci.tv/static-assets/images/bcci-logo.png",
    icc: "https://resources.pulse.icc-cricket.com/photo-resources/2020/09/01/16061289-1579463470-9b6ff71d-5420-48c7-bf64-7e58e9a2c813/ICC-logo.png",
    ca: "https://www.cricket.com.au/-/media/News/CA_logo_primary.ashx",
    ecb: "https://resources.ecb.co.uk/photo-resources/2020/07/03/31a7e6d8-6092-4a5e-82e5-fb2cc277f2c4/ECB_logo.png"
};

const builder = new addonBuilder({
    id: "org.cricket.highlights",
    version: "1.0.0",
    name: "Cricket Highlights (Auto-updating)",
    description: "Latest cricket highlights from BCCI, ICC, CA, and ECB. Updated hourly.",
    catalogs: [
        {
            type: "movie",
            id: "cricket_highlights",
            name: "Cricket Highlights"
        }
    ],
    resources: ["catalog", "stream"],
    types: ["movie"]
});

builder.defineCatalogHandler(async ({ id, type }) => {
    if (id !== "cricket_highlights") return { metas: [] };

    const cacheKey = "highlight_cache";
    const cached = cache.get(cacheKey);
    if (cached) return { metas: cached };

    const metas = [];

    try {
        const bcci = await axios.get("https://www.bcci.tv/international/men/videos/latest");
        const $bcci = cheerio.load(bcci.data);
        $bcci(".video-list__item").slice(0, 5).each((i, el) => {
            const title = $bcci(el).find(".video-list__title").text().trim();
            const href = "https://www.bcci.tv" + $bcci(el).find("a").attr("href");
            const thumbnail = $bcci(el).find("img").attr("data-src");
            metas.push({
                id: encodeURIComponent(href),
                type: "movie",
                name: title + " (BCCI)",
                poster: thumbnail || logos.bcci,
                logo: logos.bcci
            });
        });
    } catch {}

    try {
        const icc = await axios.get("https://www.icc-cricket.com/videos");
        const $icc = cheerio.load(icc.data);
        $icc(".video-card__wrapper").slice(0, 5).each((i, el) => {
            const title = $icc(el).find(".video-card__title").text().trim();
            const href = "https://www.icc-cricket.com" + $icc(el).find("a").attr("href");
            const thumbnail = $icc(el).find("img").attr("src");
            metas.push({
                id: encodeURIComponent(href),
                type: "movie",
                name: title + " (ICC)",
                poster: thumbnail || logos.icc,
                logo: logos.icc
            });
        });
    } catch {}

    try {
        const ca = await axios.get("https://www.cricket.com.au/videos/latest-videos");
        const $ca = cheerio.load(ca.data);
        $ca(".listing__item").slice(0, 5).each((i, el) => {
            const title = $ca(el).find(".listing__heading").text().trim();
            const href = "https://www.cricket.com.au" + $ca(el).find("a").attr("href");
            const thumbnail = $ca(el).find("img").attr("src");
            metas.push({
                id: encodeURIComponent(href),
                type: "movie",
                name: title + " (CA)",
                poster: thumbnail || logos.ca,
                logo: logos.ca
            });
        });
    } catch {}

    try {
        const ecb = await axios.get("https://www.ecb.co.uk/video");
        const $ecb = cheerio.load(ecb.data);
        $ecb(".video-list-item").slice(0, 5).each((i, el) => {
            const title = $ecb(el).find(".video-title").text().trim();
            const href = "https://www.ecb.co.uk" + $ecb(el).find("a").attr("href");
            const thumbnail = $ecb(el).find("img").attr("src");
            metas.push({
                id: encodeURIComponent(href),
                type: "movie",
                name: title + " (ECB)",
                poster: thumbnail || logos.ecb,
                logo: logos.ecb
            });
        });
    } catch {}

    cache.set(cacheKey, metas);
    return { metas };
});

builder.defineStreamHandler(({ id }) => {
    return Promise.resolve({
        streams: [
            {
                title: "Watch",
                url: decodeURIComponent(id)
            }
        ]
    });
});

module.exports = builder.getInterface();
