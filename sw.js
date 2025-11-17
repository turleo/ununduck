const addResourcesToCache = async (resources) => {
  const version = await (await fetch("/version")).text();
  const cache = await caches.open(version);
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/assets/bangs.json",
    ]),
  );
});

self.addEventListener("fetch", async (event) => {
  event.respondWith(getResponse(event.request))
});

async function getResponse(request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  if (!query) {
    return await fetch(request);
  }
  const bangsResponse = await caches.match("/assets/bangs.json");
  const bangsBlob = await bangsResponse.blob();
  const bangs = JSON.parse(await bangsBlob.text());
  const match = query.match(/!(\S+)/i);

  let bangCandidate;
  if (match) {
    bangCandidate = match[1].toLowerCase();
  } else {
    bangCandidate = "g";
  }
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) {
    return (
      new Response(`searchUrl is ${searchUrl}>`, {
        status: 500,
        headers: { 
          "Content-Type": "text/plain",
        },
      })
    );
  }

  return (
    new Response(`<a href="${searchUrl}>">Search!</a>`, {
      status: 301,
      headers: { 
        "Content-Type": "text/html",
        "Location": searchUrl
      },
    })
  );

}
