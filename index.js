const http = require("http");
const addonInterface = require("./addon"); // this loads the exported Stremio addon interface

const port = process.env.PORT || 7000;

http.createServer((req, res) => {
    addonInterface(req, res);
}).listen(port, () => {
    console.log(`Stremio addon running on port ${port}`);
});
