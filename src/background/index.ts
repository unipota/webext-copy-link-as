import { browser } from "webextension-polyfill-ts";

const onCreated = () => {
  console.log("created!");
};

browser.menus.create(
  {
    id: "copy-link-to-clipboard",
    title: "HTML",
    contexts: ["all"],
  },
  onCreated
);

browser.menus.create(
  {
    id: "copy-link-to-clipboard-mardown",
    title: "Markdown",
    contexts: ["all"],
  },
  onCreated
);

browser.menus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  if (info.menuItemId === "copy-link-to-clipboard") {
    const text = "This is text: " + info.linkUrl;
    const safeUrl = escapeHTML(info.linkUrl ?? "");
    const html = `This is HTML: <a href="${safeUrl}">${safeUrl}</a>`;
    console.log(text, html);
    const code =
      "copyToClipboard(" +
      JSON.stringify(text) +
      "," +
      JSON.stringify(html) +
      ");";

    browser.tabs
      .executeScript({
        code: "typeof copyToClipboard === 'function';",
      })
      .then((results) => {
        // The content script's last expression will be true if the function
        // has been defined. If this is not the case, then we need to run
        // clipboard-helper.js to define function copyToClipboard.
        if (!results || results[0] !== true) {
          return browser.tabs.executeScript(tab.id, {
            file: "content/clipboard.js",
          });
        }
      })
      .then(() => {
        return browser.tabs.executeScript(tab.id, {
          code,
        });
      })
      .catch((error) => {
        console.error("Failed to copy text: " + error);
      });
  }
});

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
