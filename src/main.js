function noSearchDefaultPageRender() {
  const copyButton = document.querySelector(".copy-button");
  const copyIcon = copyButton.querySelector("img");
  const urlInput = document.querySelector(".url-input");

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "assets/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "assets/clipboard.svg";
    }, 2000);
  });
}

async function fetchBangs() {
  const response = await fetch("assets/bangs.json");
  return await response.json();
}


async function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = (url.searchParams.get("q") ?? "").trim();
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const bangs = await fetchBangs();

  const match = query.match(/!(\S+)/i);

  let bangCandidate;
  if (match) {
    bangCandidate = match[1].toLowerCase();
  } else {
    bangCandidate = localStorage.getItem("default-bang") ?? "g";
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
  if (!searchUrl) return null;

  return searchUrl;
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

async function pageLoaded() {
  registerServiceWorker();
  const searchUrl = await getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}


window.addEventListener("load", pageLoaded);
