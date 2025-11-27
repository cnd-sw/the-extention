# ✅ Extension Testing Checklist

Follow these steps in order to verify your extension is working properly.

## ✅ Step 1: Check Server Status

Your server is running! You should see this in your terminal:
```
* Running on http://127.0.0.1:5001
```

**Status:** ✅ Server is running (I can see it's been running for ~2 minutes)

---

## ✅ Step 2: Load Extension in Chrome

1. Open Chrome
2. Type in address bar: `chrome://extensions/`
3. Make sure **"Developer mode"** is ON (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select: `/Users/chandan/Documents/VS Code/the-extention/extension`
6. You should see "Antigravity Grammar Corrector" appear in the list

**What to look for:**
- ✨ Extension card shows "Antigravity Grammar Corrector"
- 🟢 No errors shown in red
- 🔵 Toggle is ON (blue)

---

## ✅ Step 3: Check Extension Popup

1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "Antigravity Grammar Corrector" and click it
3. A popup should open

**What to look for:**
- 🟢 Green dot in top-right corner (means server is online)
- 🔵 "Active Correction" toggle is ON
- 📊 Stats show "0 Corrections" and "0 Words Saved"

**If you see a RED dot:**
- Server is not reachable
- Make sure `python server.py` is running
- Check terminal for errors

---

## ✅ Step 4: Open Test Page

1. In Chrome, press `Cmd+O` (or File → Open File)
2. Navigate to: `/Users/chandan/Documents/VS Code/the-extention/test.html`
3. Open it

**What to look for:**
- 📄 Page loads with purple gradient background
- 📝 Multiple text input fields visible
- 🎨 Clean, modern design

---

## ✅ Step 5: Open Browser Console

**IMPORTANT:** This is how you'll see if the extension is working!

1. Right-click anywhere on the test page
2. Click **"Inspect"**
3. Click the **"Console"** tab

**What you SHOULD see:**
```
[Antigravity] Initializing extension...
[Antigravity] Extension initialized successfully
```

**If you DON'T see these messages:**
- Extension didn't load properly
- Go back to `chrome://extensions/`
- Click the refresh icon (🔄) on the Antigravity extension
- Reload the test page

---

## ✅ Step 6: Test Text Input

1. Click on the **first text input** (Regular Text Input)
2. Watch the console AND the input field

**What you SHOULD see in CONSOLE:**
```
[Antigravity] Focus event on: INPUT text
[Antigravity] Active element set
[Antigravity] Extension active status: true
```

**What you SHOULD see on PAGE:**
- ✨ A small **sparkle icon** appears in the bottom-right corner of the input field
- 🎨 Icon has a purple/blue gradient
- 🖱️ Icon is clickable

**If you DON'T see the sparkle icon:**
- Check console for error messages
- Make sure you see the focus event messages
- Try clicking on different input fields

---

## ✅ Step 7: Test Text Correction

1. Make sure the first input has text: `"hey can u help me with this im really confused about it"`
2. Click the **sparkle icon** ✨

**What you SHOULD see:**

**In CONSOLE:**
```
[Antigravity] Correcting text: hey can u help me with this im really confused...
[Antigravity] Corrected text: Can you help me with this? I am confused about it.
```

**On PAGE:**
- 🔄 Icon spins briefly (loading animation)
- ✏️ Text in the input changes to corrected version
- 📝 "u" becomes "you", "im" becomes "I am", etc.

**If nothing happens:**
- Check console for error messages
- Look for "Server responded with status: XXX"
- Make sure server is still running

---

## ✅ Step 8: Check Stats

1. Click the Antigravity extension icon again
2. Look at the stats

**What you SHOULD see:**
- 📈 "Corrections" count increased to 1
- 📊 "Words Saved" might show a number (based on compression)

---

## ✅ Step 9: Test on Real Website

Try it on a real website:

1. Go to **Twitter/X** (twitter.com or x.com)
2. Click on the "What's happening?" text box
3. Look for the sparkle icon ✨

OR

1. Go to **Reddit** (reddit.com)
2. Click "Create Post"
3. Click in the title or text field
4. Look for the sparkle icon ✨

**Note:** Some websites may have security restrictions. If it doesn't work on one site, try another.

---

## 🚨 Common Problems & Solutions

### Problem: No console messages at all
**Solution:**
1. Go to `chrome://extensions/`
2. Find Antigravity extension
3. Click "Remove" then reload it
4. Reload the test page

### Problem: "Extension active status: false"
**Solution:**
1. Click the extension icon
2. Turn ON the "Active Correction" toggle
3. Reload the page

### Problem: Console shows errors about fetch/CORS
**Solution:**
1. Make sure server is running
2. Check server terminal for errors
3. Restart the server: `Ctrl+C` then `python server.py`

### Problem: Sparkle icon appears but nothing happens when clicked
**Solution:**
1. Check console for error messages
2. Verify server is responding (check extension popup for green dot)
3. Try the test page first before real websites

### Problem: Works on test.html but not other sites
**Solution:**
- This is normal! Some sites block extensions
- Try different websites
- Gmail, Twitter, Reddit usually work well

---

## 🎉 Success Criteria

Your extension is working if:
- ✅ Console shows initialization messages
- ✅ Sparkle icon appears when you click text inputs
- ✅ Clicking sparkle icon corrects the text
- ✅ Extension popup shows green status dot
- ✅ Stats update after corrections

---

## 📸 Visual Guide

**What the sparkle icon looks like:**
- Small circular button
- Purple/blue gradient background
- White sparkle/wand icon inside
- Appears in bottom-right corner of input field
- Size: about 24x24 pixels

**Where to find console messages:**
1. Right-click → Inspect
2. Console tab
3. Look for lines starting with `[Antigravity]`

---

## Need Help?

If something isn't working:
1. Check the console messages first
2. Make sure server is running
3. Reload the extension
4. Try the test.html page
5. Check the full README.md for detailed troubleshooting
