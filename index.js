const express = require("express");
const app = express();
const fetch = require('cross-fetch');
const fs = require('fs');

fetch("https://raw.githubusercontent.com/shaunakg/notion-reading-list/master/modules.js").then(r => r.text()).then(r => {
    // Write to modules.js
    fs.writeFileSync("modules.js", r);
    console.log("modules.js written");

    const { fetchAndUpdate } = require("./modules");

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    });
    
    app.get("/fetch", async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.json(await fetchAndUpdate());
    });
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server started");
});
