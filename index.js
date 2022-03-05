const express = require("express");
const app = express();

const { fetchAndUpdate } = require("./modules");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/fetch", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(await fetchAndUpdate());
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server started");
});
