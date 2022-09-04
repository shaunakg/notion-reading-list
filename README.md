
# Notion Reading List - Backend
### This code is designed to be used with the guide, available [here](https://srg.id.au/notion-reading-list/).

Hi! If you're looking at this text from the repl.it page, you can continue with the steps of the guide, namely:
1. Filling in the `DATABASE_ID` and `NOTION_API_KEY` variables
2. Starting the server
3. Copying the URL and pasting it back into the guide page.

## What this server does
This server is designed to check for new pages in your Notion database every time the `/fetch` endpoint is called.
If a page's title ends with a semicolon, it will fetch book metadata and update it.

## Updating server code
Through an extremely hacky method, I've arranged it so that the index.js file will re-download modules.js from source control every time the server is started. This means that you don't have to worry about fixing bugs as it will be done automatically (when I've pushed a fix).

However, if you make your own changes to modules.js, you will have to disable auto-updating by commenting out the `fs.writeFileSync("modules.js", r);` line in index.js to prevent your changes from being overwritten.

## Privacy and safety
There are two main concerns that you might have in regards to your privacy and safety with this service.

### 1. Auto-update functionality
The auto-update functionality is designed for convienience. Previously, whenever there was a bug, I would have to write another section specifying exactly which lines of code you'd have to patch, and somehow convey that information to users (through the guide, email, etc). With the auto-update functionality, you don't have to worry about that.

However, this does mean that the server will automatically download code from a source that you don't control. This is a security risk, and if you're worried, you can disable the auto-update functionality by commenting out the `fs.writeFileSync("modules.js", r);` line in index.js.

### 2. Book cover proxy service
Notion has updated their website and now requires every page cover and icon image URL to end with an image extension. Unfortunately, this means that the book cover URLs that I fetch from the Google Books API will no longer work. 

To fix this, I've created a proxy service that will fetch the image from the Google Books API and then serve it to the client. This is a privacy risk as I could theoretically track which covers you fetch, and if you're worried, you can host the proxy service yourself on another serverless platform (I use Cloudflare Workers). The code is in `image_proxy.js`.

## Support
I hope you enjoy using this service! To support more tools like this, you can [sponsor me on Github](https://github.com/sponsors/shaunakg/).
