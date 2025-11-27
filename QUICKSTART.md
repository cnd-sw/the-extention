# Quick Start Guide

## Step 1: Install Dependencies

```bash
pip install flask flask-cors textblob spacy
python -m spacy download en_core_web_sm
```

## Step 2: Start the Server

```bash
python server.py
```

You should see:
```
* Running on http://127.0.0.1:5001
```

## Step 3: Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Turn ON "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension` folder
6. Done! You should see the Antigravity icon

## Step 4: Test It

### Option A: Use the Test Page
1. Open `test.html` in Chrome (File → Open File)
2. Click on any text input
3. Look for the sparkle icon 
4. Click it to correct the text

### Option B: Test on Any Website
1. Go to any website (e.g., Gmail, Twitter, Reddit)
2. Click on a text field
3. The sparkle icon should appear
4. Click to correct

## Troubleshooting

### No sparkle icon appearing?

**Check 1: Is the server running?**
- Look at your terminal - should show Flask running
- Click the Antigravity extension icon - status dot should be green

**Check 2: Is the extension loaded?**
- Go to `chrome://extensions/`
- Find "Antigravity Grammar Corrector"
- Make sure it's enabled (toggle is blue)

**Check 3: Check the console**
- Right-click on the page → Inspect → Console
- You should see: `[Antigravity] Initializing extension...`
- When you click an input, you should see: `[Antigravity] Focus event on: INPUT text`

**Check 4: Reload everything**
- Reload the extension at `chrome://extensions/`
- Reload the webpage you're testing
- Restart the server

### Server won't start?

```bash
# Make sure port 5001 is not in use
lsof -i :5001

# If something is using it, kill it or change the port in server.py and manifest.json
```

### Extension loads but nothing happens?

1. Open browser console (F12)
2. Look for errors
3. Check if you see `[Antigravity]` messages
4. Try the test.html page first

## What Should Happen

1. **Click on text input** → Sparkle icon appears bottom-right
2. **Click sparkle icon** → Icon spins (loading)
3. **Text gets corrected** → Casual → Professional
4. **Check popup** → Stats update (corrections count)

## Example Corrections

**Before:** "hey can u help me with this im really confused"
**After:** "Can you help me with this? I am confused."

**Before:** "im very interested in this project basically"
**After:** "I am interested in this project."

## Need More Help?

Check the full README.md for detailed troubleshooting.
