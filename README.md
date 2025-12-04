# SVG Extractor Chrome Extension

A simple and elegant Chrome extension that allows you to extract SVG content from any webpage with a single click.

## Features

- 🎯 **Click to Copy**: Simply click on any SVG element to copy its source code to your clipboard
- 👁️ **Visual Feedback**: Hover over SVG elements to see them highlighted with a green outline
- ✅ **Copy Confirmation**: Get instant visual confirmation when SVG code is copied
- 🔄 **Toggle On/Off**: Click the extension icon to enable or disable the extractor
- 💾 **Persistent State**: Your enabled/disabled preference is saved across sessions
- 🏷️ **Visual Status**: Badge shows "OFF" when disabled, clear when active

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `svg-extractor` folder

## Usage

1. **Toggle the Extension**: Click the SVG Extractor icon in your Chrome toolbar to enable/disable it
   - When active: No badge shown, tooltip says "SVG Extractor (Active) - Click to disable"
   - When disabled: Red "OFF" badge shown, tooltip says "SVG Extractor (Disabled) - Click to enable"
2. **Navigate to Any Webpage**: Go to any website with SVG elements
3. **Hover Over SVGs**: Move your mouse over SVG elements - they will be highlighted with a green outline
4. **Click to Copy**: Click on any highlighted SVG to copy its source code to your clipboard
5. **Paste Anywhere**: Use Ctrl+V (Cmd+V on Mac) to paste the SVG code wherever you need it

## How It Works

The extension consists of several components:

- **Content Script** (`content.js`): Runs on every webpage, detects SVG elements, handles hover effects, and manages clipboard copying
- **Content Styles** (`content.css`): Provides visual feedback with hover outlines and copy animations
- **Background Service Worker** (`background.js`): Handles extension icon clicks and manages toggle state
- **Manifest** (`manifest.json`): Defines extension permissions and configuration

## Permissions

- **activeTab**: Required to interact with the current webpage
- **storage**: Used to save your enabled/disabled preference

## Development

The extension is built with vanilla JavaScript and requires no build process. Simply edit the files and reload the extension in Chrome.

## License

MIT License - feel free to use and modify as needed!

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.
