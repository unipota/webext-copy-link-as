import * as clipboard from './clipboard.js.txt'
import { escape } from 'html-escaper'
import { browser } from 'webextension-polyfill-ts'

const onCreated = () => {
  console.log('contextMenu created!')
}

browser.contextMenus.create(
  {
    id: 'copy-link-to-clipboard',
    title: 'HTML',
    contexts: ['all'],
  },
  onCreated
)

browser.contextMenus.create(
  {
    id: 'copy-link-to-clipboard-markdown',
    title: 'Markdown',
    contexts: ['all'],
  },
  onCreated
)

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) return

  const { title, url } = tab
  const safeUrl = escape(url ?? '')
  let text: string, copyCode: string
  switch (info.menuItemId) {
    case 'copy-link-to-clipboard':
      text = `<a href=\'${safeUrl}\'>${title}</a>`
      copyCode = `copyToClipboard("${text}", true);`
      break
    case 'copy-link-to-clipboard-markdown':
      text = `[${title}](${safeUrl})`
      copyCode = `copyToClipboard("${text}", false);`
      break
  }

  browser.tabs
    .executeScript(tab.id, { code: clipboard.default })
    .then((_) => {
      return browser.tabs.executeScript(tab.id, { code: copyCode })
    })
    .catch((error) => {
      console.error(error)
    })
})
