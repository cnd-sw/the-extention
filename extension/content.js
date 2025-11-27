let activeElement = null;
let triggerBtn = null;

// Initialize
function init() {
    createTriggerButton();
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('focusout', handleBlur, true);
    document.addEventListener('input', updateTriggerPosition, true);
    document.addEventListener('scroll', updateTriggerPosition, true);
    window.addEventListener('resize', updateTriggerPosition);
}

function createTriggerButton() {
    triggerBtn = document.createElement('div');
    triggerBtn.className = 'antigravity-trigger';
    triggerBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.3,13.74L10.74,17.3C10.22,17.82 9.38,17.82 8.86,17.3L5.4,13.84C4.88,13.32 4.88,12.48 5.4,11.96L8.96,8.4L14.3,13.74Z" />
    </svg>
  `;
    triggerBtn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent losing focus
        correctText();
    });
    document.body.appendChild(triggerBtn);
}

function handleFocus(e) {
    const target = e.target;

    // Check if editable
    if (!isEditable(target)) {
        hideTrigger();
        return;
    }

    // Check for sensitive fields
    if (isSensitive(target)) {
        hideTrigger();
        return;
    }

    activeElement = target;

    // Check if extension is active
    chrome.storage.local.get(['isActive'], (result) => {
        if (result.isActive !== false) { // Default to true
            showTrigger(target);
        }
    });
}

function handleBlur(e) {
    // Delay hiding to allow click on trigger
    setTimeout(() => {
        if (document.activeElement !== activeElement) {
            hideTrigger();
            activeElement = null;
        }
    }, 200);
}

function isEditable(element) {
    return element.isContentEditable ||
        element.tagName === 'TEXTAREA' ||
        (element.tagName === 'INPUT' && element.type === 'text');
}

function isSensitive(element) {
    const type = element.type;
    const name = element.name || '';
    const id = element.id || '';

    if (type === 'password' || type === 'email' || type === 'tel') return true;

    const sensitiveKeywords = ['password', 'credit', 'card', 'cvv', 'ssn', 'secret', 'token', 'key'];
    const identifier = (name + ' ' + id).toLowerCase();

    return sensitiveKeywords.some(keyword => identifier.includes(keyword));
}

function showTrigger(element) {
    updateTriggerPosition();
    triggerBtn.classList.add('visible');
}

function hideTrigger() {
    if (triggerBtn) {
        triggerBtn.classList.remove('visible');
    }
}

function updateTriggerPosition() {
    if (!activeElement || !triggerBtn.classList.contains('visible')) return;

    const rect = activeElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Position at bottom right of the input
    triggerBtn.style.top = `${rect.bottom + scrollTop - 30}px`;
    triggerBtn.style.left = `${rect.right + scrollLeft - 30}px`;
}

async function correctText() {
    if (!activeElement) return;

    const originalText = activeElement.value || activeElement.innerText;
    if (!originalText || originalText.trim().length === 0) return;

    // Show loading state
    triggerBtn.classList.add('antigravity-loading');

    // Get mode
    chrome.storage.local.get(['mode'], async (result) => {
        const mode = result.mode || 'professional';

        try {
            const response = await fetch('http://localhost:5001/correct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: originalText, mode: mode })
            });

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();
            const correctedText = data.corrected;

            if (correctedText && correctedText !== originalText) {
                applyCorrection(correctedText);
                updateStats(originalText.length - correctedText.length);
            }

        } catch (error) {
            console.error('Antigravity Error:', error);
        } finally {
            triggerBtn.classList.remove('antigravity-loading');
        }
    });
}

function applyCorrection(newText) {
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;

        activeElement.value = newText;

        // Try to restore cursor? Might be hard if length changed drastically.
        // Just put it at the end for now.
        activeElement.selectionStart = activeElement.selectionEnd = newText.length;
    } else {
        activeElement.innerText = newText;
    }

    // Trigger input event to notify frameworks (React, etc.)
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
}

function updateStats(charsSaved) {
    chrome.storage.local.get(['stats'], (result) => {
        const stats = result.stats || { corrections: 0, savedWords: 0 };
        stats.corrections++;
        // Estimate words saved (chars / 5)
        if (charsSaved > 0) {
            stats.savedWords += Math.ceil(charsSaved / 5);
        }
        chrome.storage.local.set({ stats });
    });
}

init();
