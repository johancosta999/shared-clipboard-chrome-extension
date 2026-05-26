/* global chrome */

document.addEventListener("copy", () => {
  const text = window.getSelection().toString();

  if (text && text.trim() !== "") {
    chrome.runtime.sendMessage({
      type: "clipboard",
      text: text,
    });
  }
});