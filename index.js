const express = require("express");
const addonInterface = require("./addon");

const app = express();
const PORT = process.env.PORT || 10000;

// Manifest route
app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

// Catalog route (no .json in the route path to avoid parsing issues)
app.get("/catalog/:type/:id/:extra?", (req, res) => {
    addonInterface.catalog(req, res);
});

// Stream route (same: remove .json from route definition)
app.get("/stream/:type/:id", (req, res) => {
    addonInterface.stream(req, res);
});

// Start server
app.listen(PORT, () => {
    console.log(`Stremio addon running on port ${PORT}`);
});
