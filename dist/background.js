/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/***/ (() => {

eval("const onCreated = () => {\n  console.log(\"created!\");\n};\n\nbrowser.menus.create(\n  {\n    id: \"copy-link-to-clipboard\",\n    title: \"HTML\",\n    contexts: [\"all\"],\n  },\n  onCreated\n);\n\nbrowser.menus.create(\n  {\n    id: \"copy-link-to-clipboard-mardown\",\n    title: \"Markdown\",\n    contexts: [\"all\"],\n  },\n  onCreated\n);\n\nbrowser.menus.onClicked.addListener((info, tab) => {\n  if (info.menuItemId === \"copy-link-to-clipboard\") {\n    const text = \"This is text: \" + info.linkUrl;\n    const safeUrl = escapeHTML(info.linkUrl);\n    const html = `This is HTML: <a href=\"${safeUrl}\">${safeUrl}</a>`;\n    console.log(text, html);\n    const code =\n      \"copyToClipboard(\" +\n      JSON.stringify(text) +\n      \",\" +\n      JSON.stringify(html) +\n      \");\";\n\n    browser.tabs\n      .executeScript({\n        code: \"typeof copyToClipboard === 'function';\",\n      })\n      .then((results) => {\n        // The content script's last expression will be true if the function\n        // has been defined. If this is not the case, then we need to run\n        // clipboard-helper.js to define function copyToClipboard.\n        if (!results || results[0] !== true) {\n          return browser.tabs.executeScript(tab.id, {\n            file: \"content/clipboard.js\",\n          });\n        }\n      })\n      .then(() => {\n        return browser.tabs.executeScript(tab.id, {\n          code,\n        });\n      })\n      .catch((error) => {\n        console.error(\"Failed to copy text: \" + error);\n      });\n  }\n});\n\n// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546\nfunction escapeHTML(str) {\n  return String(str)\n    .replace(/&/g, \"&amp;\")\n    .replace(/\"/g, \"&quot;\")\n    .replace(/'/g, \"&#39;\")\n    .replace(/</g, \"&lt;\")\n    .replace(/>/g, \"&gt;\");\n}\n\n\n//# sourceURL=webpack://copy-link-as/./src/background.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background.js"]();
/******/ 	
/******/ })()
;