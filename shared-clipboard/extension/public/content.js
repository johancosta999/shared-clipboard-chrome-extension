/* global chrome */

document.addEventListener("copy", () => {
  const text = window.getSelection().toString();

  if (text && text.trim() !== "") {
    try {
      chrome.runtime.sendMessage({
        type: "clipboard",
        text: text,
      });
    } catch (err) {
      // Extension was reloaded, context is gone — ignore silently
      console.error(err);
    }
  }
});