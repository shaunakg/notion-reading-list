const express = require("express");
const app = express();
const fetch = require("cross-fetch");
const fs = require("fs");
const { fetchAndUpdate, insertCustomPage, fetchPage, fetchProperty, deletePage } = require("./modules");
const Client = require("@replit/database");

const replitDb = new Client();

require("dotenv").config();

async function main() {
  if (!(process.env.NOTION_API_KEY && process.env.DATABASE_ID)) {
    throw new Error("Please fill in your API key and database ID in repl.it");
  }

  if (process.env.NO_AUTO_UPDATE !== "true") {

    // Get the commit head from `.git/refs/heads/master`
    const commitHead = fs.readFileSync(".git/refs/heads/master", "utf8");

    // Get the commit head from the Github API
    const githubResponse = await (await fetch("https://api.github.com/repos/shaunakg/notion-reading-list/commits/master")).json()["commit"]["tree"]["sha"];

    // If the commit heads don't match, notify that there's an update available
    if (commitHead !== githubResponse) {

      console.log("\n\n============================");
      console.log("There's an update available!");
      console.log("Please update your repl.it to the latest version.");
      console.log("https://github.com/shaunakg/notion-reading-list/wiki/Updating");
      console.log("============================\n\n");

      const update_notification = await replitDb.get("update_notification");
      if (!update_notification) {

        // Create a new entry in the Notion database indicating that there's an update available
        const page = await insertCustomPage(process.env.DATABASE_ID, {

          Title: {
            title: [
              {
                type: "text",
                text: {
                  content: "Notion Reading List update available",
                },
              },
            ],
          },

          "Genre(s)": {
            multi_select: [{
              name: "System notification"
            }]
          },

          Description: {
            rich_text: [
              {
                text: {
                  content: `Notion Reading List has an update available. Tick the checkbox on the left to trigger an update. If you don't want to update, you can ignore this message, or delete the page. (${commitHead} -> ${githubResponse})`,
                },
              },
            ],
          },

        });

        await replitDb.set("update_notification", {
          page_id: page.id,
          checkbox_property_id: page.properties["Read?"].id
        });
      } else {

        const checkbox_ticked = await (await fetchProperty(update_notification.page_id, update_notification.checkbox_property_id)).object.checkbox;
        if (checkbox_ticked) {

          // Perform the update
          // Run `git pull` to update the code
          // Next time the server starts, it will use the new code.
          const { exec } = require("child_process");
          exec("git pull", (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
          });

          // Delete the notification page
          await deletePage(update_notification.page_id);

        }

      }

    }

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

  if (process.env.AUTO_FETCH_INTERVAL) {
    fetchAndUpdate();
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
  console.error("Error from main function", e);
  throw e;
});
