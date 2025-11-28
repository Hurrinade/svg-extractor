// Popup script for SVG Extractor
let isEnabled = true;

// Get DOM elements
const toggleSwitch = document.getElementById("toggleSwitch");

// Load saved state
chrome.storage.local.get(["extractorEnabled"], (result) => {
  isEnabled = result.extractorEnabled !== false; // Default to true
  updateToggleUI();
});

// Toggle switch click handler
toggleSwitch.addEventListener("click", () => {
  isEnabled = !isEnabled;

  // Save state
  chrome.storage.local.set({ extractorEnabled: isEnabled });

  // Update UI
  updateToggleUI();

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs
        .sendMessage(tabs[0].id, {
          action: "toggle",
          enabled: isEnabled,
        })
        .catch(() => {
          // Content script might not be loaded yet, that's okay
        });
    }
  });
});

// Update toggle UI based on state
function updateToggleUI() {
  if (isEnabled) {
    toggleSwitch.classList.add("active");
  } else {
    toggleSwitch.classList.remove("active");
  }
}
