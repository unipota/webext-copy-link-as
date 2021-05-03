function copyToClipboard(text: string, html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;

  container.style.position = "fixed";
  container.style.pointerEvents = "none";
  container.style.opacity = "0";

  document.body.appendChild(container);
  window.getSelection()?.removeAllRanges();

  const range = document.createRange();
  range.selectNode(container);
  window.getSelection()?.addRange(range);

  document.execCommand("copy");
}
