
// This is an image proxy service for the Google Books API's book cover functionality.

// Example usage: https://readinglist-cover-proxy.srg.id.au/A2wJAAAAQAAJ.jpg

// It is a small piece of code developed because Notion has (for some reason) stopped accepting
// cover image URLs that don't end in an image file extension.

// !!!! This should not be used in the repl.it server. It is only here for the purpose of informing
// users on why there is a proxy service in the first place. If you want to run your own, you can
// copy this code to Cloudflare Workers or a similar function-as-a-service provider.

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

    const url = new URL(request.url);
    const pathname = url.pathname.split("/")[url.pathname.split("/").length - 1]

    if (pathname == "") {
        // Redirect user to info page
        return Response.redirect("https://srg.id.au/notion-reading-list/#image-proxy")
    }

    const id = pathname.split(".")[0];

    console.log(pathname, id)

    const gbResponse = await (await fetch("https://www.googleapis.com/books/v1/volumes/" + id)).json();

    const coverUrl = gbResponse?.volumeInfo?.imageLinks?.thumbnail;

    if (!coverUrl) {
        return new Response("This book doesn't have a cover available.", { status: 404 })
    }

    console.log(coverUrl)

    return new Response(await (await fetch(coverUrl)).blob(), {
        cacheEverything: true, // For Cloudflare Workers
    })

}