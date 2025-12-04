// Background service worker for SVG Extractor
let isEnabled = true;

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["extractorEnabled"], (result) => {
    isEnabled = result.extractorEnabled !== false; // Default to true
    updateIcon();
  });
});

// Load state on startup
chrome.storage.local.get(["extractorEnabled"], (result) => {
  isEnabled = result.extractorEnabled !== false;
  updateIcon();
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Toggle the state
  isEnabled = !isEnabled;

  // Save the new state
  chrome.storage.local.set({ extractorEnabled: isEnabled });

  // Update the icon to reflect the new state
  updateIcon();

  // Send message to content script in the active tab
  chrome.tabs
    .sendMessage(tab.id, {
      action: "toggle",
      enabled: isEnabled,
    })
    .catch(() => {
      // Content script might not be loaded yet, that's okay
      console.log("Content script not ready, state will sync on page load");
    });
});

// Update icon based on enabled/disabled state
function updateIcon() {
  // Update badge to show state
  if (isEnabled) {
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#F44336" });
  }

  // Update the title to show current state
  const title = isEnabled
    ? "SVG Extractor (Active) - Click to disable"
    : "SVG Extractor (Disabled) - Click to enable";

  chrome.action.setTitle({ title: title });
}
