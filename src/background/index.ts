import { browser } from "webextension-polyfill-ts";
import * as clipboard from "./clipboard.js.txt";

const onCreated = () => {
  console.log("contextMenu created!");
};

browser.contextMenus.create(
  {
    id: "copy-link-to-clipboard",
    title: "HTML",
    contexts: ["all"],
  },
  onCreated
);

browser.contextMenus.create(
  {
    id: "copy-link-to-clipboard-markdown",
    title: "Markdown",
    contexts: ["all"],
  },
  onCreated
);

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) return;

  const { title, url } = tab;
  const safeUrl = escapeHTML(url ?? "");
  let text;
  switch (info.menuItemId) {
    case "copy-link-to-clipboard":
      text = `<a href=\'${safeUrl}\'>${title}</a>`;
      break;
    case "copy-link-to-clipboard-markdown":
      text = `[${title}](${safeUrl})`;
      break;
  }
  const copyCode = `copyToClipboard("${text}");`;

  browser.tabs
    .executeScript(tab.id, { code: clipboard.default })
    .then((_) => {
      return browser.tabs.executeScript(tab.id, { code: copyCode });
    })
    .catch((error) => {
      console.error(error);
    });
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
