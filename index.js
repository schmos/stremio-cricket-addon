const express = require("express");
const addonInterface = require("./addon");

const app = express();
const port = process.env.PORT || 7000;

app.use("/", addonInterface.getRouter());

app.listen(port, () => {
  console.log(`Stremio addon running on port ${port}`);
});
