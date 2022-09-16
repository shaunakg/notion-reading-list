const express = require("express");
const app = express();
const fetch = require("cross-fetch");
const fs = require("fs");
const { fetchAndUpdate } = require("./modules");
require("dotenv").config();

async function main() {
  if (!(process.env.NOTION_API_KEY && process.env.DATABASE_ID)) {
    throw new Error("Please fill in your API key and database ID in repl.it");
  }

  if (process.env.NO_AUTO_UPDATE !== "true") {
    await fetch(
      "https://raw.githubusercontent.com/shaunakg/notion-reading-list/master/modules.js"
    )
      .then((r) => r.text())
      .then((r) => {
        // Write to modules.js
        fs.writeFileSync("modules.js", r);
        console.log("modules.js written");
      });
  }

  if (process.env.AUTO_FETCH) {
    setInterval(fetchAndUpdate, process.env.AUTO_FETCH);
  }

  app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/fetch", async (_req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(await fetchAndUpdate());
  });

  app.listen(process.env.PORT || 8080, () => {
    console.log("Server started");
  });
}

main().catch(async (e) => {
  logger.error("Error from main function", e);
  throw e;
});
