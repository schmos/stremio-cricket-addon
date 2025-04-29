const express = require("express");
const addonInterface = require("./addon");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

app.get("/catalog/:type/:id/:extra?.json", (req, res) => {
    addonInterface.catalog(req, res);
});

app.get("/stream/:type/:id.json", (req, res) => {
    addonInterface.stream(req, res);
});

app.listen(PORT, () => {
    console.log(`Stremio addon running on port ${PORT}`);
});
