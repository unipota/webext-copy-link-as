import * as clipboard from './clipboard.js.txt'
import { escape } from 'html-escaper'
import { browser } from 'webextension-polyfill-ts'

const ContextTypes = [
  'browser_action',
  'editable',
  'frame',
  'image',
  'link',
  'page',
  'page_action',
  'password',
  'selection',
  'vieo',
] as const

const htmlLink = (url: string | undefined, text: string | undefined) =>
  `<a href='${url}'>${text}</a>`

const markdownLink = (url: string | undefined, text: string | undefined) =>
  `[${text}](${url})`

const copyCode = (value: string, isHtml = false) => {
  if (isHtml) {
    return `copyHtml("${value}");`
  } else {
    return `copyText("${value}");`
  }
}

browser.contextMenus.create({
  id: 'html-page',
  title: 'HTML',
  contexts: ['page'],
})

browser.contextMenus.create({
  id: 'markdown-page',
  title: 'Markdown',
  contexts: ['page'],
})

browser.contextMenus.create({
  id: 'html-link',
  title: 'HTML link',
  contexts: ['link'],
})

browser.contextMenus.create({
  id: 'html-tab',
  title: 'HTML tab',
  contexts: ['tab'],
})

browser.contextMenus.create({
  id: 'separator-1',
  type: 'separator',
  contexts: ['all'],
})

browser.contextMenus.create({
  id: 'configure',
  title: '設定',
  contexts: ['all'],
})

const executeCopy = (tabId: number | undefined, code: string) => {
  browser.tabs
    .executeScript(tabId, { code: clipboard.default })
    .then((_) => {
      return browser.tabs.executeScript(tabId, { code })
    })
    .catch((error) => {
      console.error(error)
    })
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return

  switch (info.menuItemId) {
    case 'html-page': {
      const { title, url } = tab
      const safeUrl = escape(url ?? '')
      const html = htmlLink(safeUrl, title)
      const code = copyCode(html, true)
      executeCopy(tab.id, code)
      break
    }

    case 'markdown-page': {
      const { title, url } = tab
      const safeUrl = escape(url ?? '')
      const text = markdownLink(safeUrl, title)
      const code = copyCode(text)
      executeCopy(tab.id, code)
      break
    }

    case 'html-link': {
      const { linkText, linkUrl } = info
      const safeUrl = escape(linkUrl ?? '')
      const html = htmlLink(safeUrl, linkText)
      const code = copyCode(html, true)
      executeCopy(tab.id, code)
      break
    }

    case 'html-tab': {
      const { title, url } = tab
      const safeUrl = escape(url ?? '')
      const html = htmlLink(safeUrl, title)
      const code = copyCode(html, true)
      executeCopy(tab.id, code)
      break
    }
  }
})
