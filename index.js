
const express = require('express');
const app = express();

const {fetchAndUpdate} = require("./modules");

app.get("*", (req, res) => {
    fetchAndUpdate().then(() => {
        res.header("Access-Control-Allow-Origin", "*");
        res.send("OK");
    });
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Server started");
});