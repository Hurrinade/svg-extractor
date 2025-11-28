// SVG Extractor Content Script
(function () {
  "use strict";

  let isExtractorActive = true;
  let hoveredSVG = null;

  // Load saved state
  chrome.storage.local.get(["extractorEnabled"], (result) => {
    isExtractorActive = result.extractorEnabled !== false;
  });

  // Function to get the full SVG content including all attributes
  function getSVGContent(svgElement) {
    // Clone the SVG to avoid modifying the original
    const clone = svgElement.cloneNode(true);

    // Remove any added classes from our extension
    clone.classList.remove("svg-extractor-hover");

    // Get the outer HTML
    return clone.outerHTML;
  }

  // Function to copy text to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  // Function to show notification
  function showNotification(message, success = true) {
    const notification = document.createElement("div");
    notification.className = `svg-extractor-notification ${
      success ? "success" : "error"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Remove after 2 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  // Function to find the closest SVG element
  function findSVGElement(element) {
    if (!element) return null;

    // Check if the element itself is an SVG (case-insensitive and namespace check)
    if (element.tagName && element.tagName.toLowerCase() === "svg") {
      return element;
    }

    // Alternative check using namespaceURI for SVG elements
    if (
      element.namespaceURI === "http://www.w3.org/2000/svg" &&
      element.tagName.toLowerCase() === "svg"
    ) {
      return element;
    }

    // Check if the element is inside an SVG
    let current = element;
    while (current && current !== document.body) {
      if (current.tagName && current.tagName.toLowerCase() === "svg") {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  }

  // Mouse move handler to add hover effect
  function handleMouseMove(e) {
    if (!isExtractorActive) return;

    try {
      const svgElement = findSVGElement(e.target);

      // Remove hover from previous element
      if (hoveredSVG && hoveredSVG !== svgElement) {
        hoveredSVG.classList.remove("svg-extractor-hover");
      }

      // Add hover to current element
      if (svgElement) {
        svgElement.classList.add("svg-extractor-hover");
        hoveredSVG = svgElement;
        if (document.body) {
          document.body.style.cursor = "pointer";
        }
      } else {
        hoveredSVG = null;
        if (document.body) {
          document.body.style.cursor = "";
        }
      }
    } catch (err) {
      console.error("SVG Extractor - Mouse move error:", err);
    }
  }

  // Click handler to copy SVG content
  function handleClick(e) {
    if (!isExtractorActive) return;

    try {
      const svgElement = findSVGElement(e.target);

      if (svgElement) {
        e.preventDefault();
        e.stopPropagation();

        const svgContent = getSVGContent(svgElement);
        console.log(
          "SVG Extractor - Copying SVG:",
          svgContent.substring(0, 100) + "..."
        );

        copyToClipboard(svgContent)
          .then((success) => {
            if (success) {
              showNotification("✓ SVG copied to clipboard!", true);
              console.log("SVG Extractor - Copy successful");

              // Add a brief flash effect
              svgElement.classList.add("svg-extractor-copied");
              setTimeout(() => {
                svgElement.classList.remove("svg-extractor-copied");
              }, 300);
            } else {
              showNotification("✗ Failed to copy SVG", false);
              console.error("SVG Extractor - Copy failed");
            }
          })
          .catch((err) => {
            showNotification("✗ Failed to copy SVG", false);
            console.error("SVG Extractor - Copy error:", err);
          });
      }
    } catch (err) {
      console.error("SVG Extractor - Click handler error:", err);
    }
  }

  // Add event listeners
  document.addEventListener("mousemove", handleMouseMove, true);
  document.addEventListener("click", handleClick, true);

  // Listen for messages from popup to toggle functionality
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle") {
      isExtractorActive = request.enabled;

      // Remove any hover effects when disabled
      if (!isExtractorActive && hoveredSVG) {
        hoveredSVG.classList.remove("svg-extractor-hover");
        hoveredSVG = null;
        document.body.style.cursor = "";
      }

      sendResponse({ success: true });
    }
  });

  console.log("SVG Extractor: Active and ready!");
})();
