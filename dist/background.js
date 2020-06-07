chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage(() => console.log('options page opened'))
})
