# Notion Reading List - Backend

### This code is designed to be used with the guide, available [here](https://srg.id.au/notion-reading-list/).

Hi! If you're looking at this text from the repl.it page, you can continue with the steps of the guide, namely:

1. Filling in the `DATABASE_ID` and `NOTION_API_KEY` variables
2. Starting the server
3. Copying the URL and pasting it back into the guide page.

## What this server does

This server is designed to check for new pages in your Notion database every time the `/fetch` endpoint is called. Optionally, if you specify a `AUTO_FETCH_INTERVAL` (in ms) environment variable, it will automatically check Notion for updates on that interval.
If a page's title ends with a semicolon, it will fetch book metadata and update it.

## Updating server code

Through an extremely hacky method, I've arranged it so that the index.js file will re-download modules.js from source control every time the server is started. This means that you don't have to worry about fixing bugs as it will be done automatically (when I've pushed a fix).

However, if you make your own changes to modules.js, you will have to disable auto-updating by either setting the environment variable `NO_AUTO_UPDATE=true` or commenting out the `fs.writeFileSync("modules.js", r);` line in index.js to prevent your changes from being overwritten.

## Privacy and safety

There is a possible concern that you might have in regards to your privacy and safety with this service.

### 1. Auto-update functionality

The auto-update functionality is designed for convienience. Previously, whenever there was a bug, I would have to write another section specifying exactly which lines of code you'd have to patch, and somehow convey that information to users (through the guide, email, etc). With the auto-update functionality, you don't have to worry about that.

However, this does mean that the server will automatically download code from a source that you don't control. This is a security risk, and if you're worried, you can disable the auto-update functionality by either setting the environment variable `NO_AUTO_UPDATE=true` or commenting out the `fs.writeFileSync("modules.js", r);` line in index.js.

## Docker

This repo comes with a Dockerfile if you wish to run this locally or on your own server.

1. Copy the `.env.example` to `.env` and fill in with the appropriate values.
2. In your terminal of choice, run `docker build -t notion-reading-list .`
3. Run `docker run --env-file=.env notion-reading-list`.
4. Now you have a container running that you can manage locally.

## Support

I hope you enjoy using this service! To support more tools like this, you can [sponsor me on Github](https://github.com/sponsors/shaunakg/).
