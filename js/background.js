const activeTabs = new Set();

const changeStatus = (tabId) => {
  chrome.action.setBadgeText({
    text: activeTabs.has(tabId) ? "ON" : "",
    tabId,
  });
};

chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "status") {
    const tabId = sender?.tab?.id;
    if (tabId) {
      sendResponse({ active: activeTabs.has(tabId) });
      changeStatus(tabId);
    }
  }
});

chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  chrome.action.getBadgeText({ tabId }, (text) => {
    const enable = text !== "ON";
    chrome.tabs.sendMessage(tabId, { type: "enable", value: enable }, () => {});
    if (enable) {
      activeTabs.add(tabId);
    } else {
      activeTabs.delete(tabId);
    }
    changeStatus(tabId);
  });
});
