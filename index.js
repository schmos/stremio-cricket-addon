const express = require("express");
const addonInterface = require("./addon");

const app = express();
const PORT = process.env.PORT || 10000;

// Manifest
app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

// Catalog
app.get("/catalog/:type/:id/:extra?", (req, res) => {
    addonInterface.catalog(req, res);
});

// Stream
app.get("/stream/:type/:id", (req, res) => {
    addonInterface.stream(req, res);
});

// Listen
app.listen(PORT, () => {
    console.log(`Stremio addon running on port ${PORT}`);
});
