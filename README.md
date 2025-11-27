# Antigravity Grammar Corrector

A Chrome extension that provides local, deterministic grammar correction with professional tone normalization.

## Features

- **Local Processing**: All text processing happens on your machine
- **Privacy First**: No text is stored or logged
- **Smart Detection**: Automatically detects editable fields while avoiding sensitive inputs
- **Multiple Modes**: Professional, Concise, and Casual tone options
- **Real-time Stats**: Track corrections and words saved

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirement.txt
python -m spacy download en_core_web_sm
```

### 2. Start the Backend Server

```bash
python server.py
```

The server will start on `http://localhost:5001`

### 3. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `extension` folder from this project
5. The Antigravity icon should appear in your extensions toolbar

## Usage

1. **Start the server**: Make sure `server.py` is running
2. **Navigate to any webpage** with text inputs
3. **Click on a text field** - you should see a small sparkle icon appear in the bottom-right corner of the field
4. **Click the sparkle icon** to correct the text
5. **Check the extension popup** to view stats and change settings

## Troubleshooting

### Extension not working?

1. **Check the console**: 
   - Right-click on the page → Inspect → Console tab
   - Look for `[Antigravity]` messages
   - You should see "Initializing extension..." and "Extension initialized successfully"

2. **Check if the server is running**:
   - Open the extension popup (click the Antigravity icon)
   - Look for the green status indicator in the top-right
   - If it's red, the server is not running

3. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Antigravity extension
   - Reload the webpage you're testing on

4. **Check permissions**:
   - Make sure the extension has permission to run on the website
   - Some sites (like chrome:// pages) don't allow extensions

### Button not appearing?

- Make sure you're clicking on a text input field (not a password field)
- Check the browser console for `[Antigravity]` debug messages
- Verify the extension is enabled in the popup

### Server connection errors?

- Ensure the server is running on port 5001
- Check that no firewall is blocking localhost connections
- Look for error messages in the terminal where server.py is running

## Supported Input Types

The extension works on:
- Text inputs (`<input type="text">`)
- Search inputs (`<input type="search">`)
- Textareas (`<textarea>`)
- ContentEditable elements
- URL, tel, number, date inputs

## Blocked Input Types

For security, the extension will NOT run on:
- Password fields
- Credit card fields
- Fields with sensitive keywords (SSN, API keys, etc.)

## Configuration

Click the extension icon to access:
- **Active Correction**: Toggle the extension on/off
- **Tone Mode**: Choose between Professional, Concise, or Casual
- **Statistics**: View total corrections and words saved

## Development

### File Structure

```
the-extention/
├── extension/
│   ├── manifest.json      # Extension configuration
│   ├── content.js         # Main content script
│   ├── content.css        # Trigger button styles
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   ├── popup.css          # Popup styles
│   └── icons/             # Extension icons
├── server.py              # Flask backend server
├── requirement.txt        # Python dependencies
└── overview.txt           # Processing guidelines
```

### Debug Mode

The extension logs detailed information to the console:
- Initialization status
- Focus events on input fields
- Text correction operations
- Server communication

Open the browser console (F12) to view these logs.

## License

MIT
