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

function noSearchDefaultPageRender() {
  registerServiceWorker();
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

window.addEventListener("load", noSearchDefaultPageRender);

