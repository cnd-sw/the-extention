let activeElement = null;
let triggerBtn = null;

// Initialize
function init() {
    console.log('[Antigravity] Initializing extension...');
    createTriggerButton();
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('focusout', handleBlur, true);
    document.addEventListener('input', updateTriggerPosition, true);
    document.addEventListener('scroll', updateTriggerPosition, true);
    window.addEventListener('resize', updateTriggerPosition);
    console.log('[Antigravity] Extension initialized successfully');
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

    console.log('[Antigravity] Focus event on:', target.tagName, target.type);

    // Check if editable
    if (!isEditable(target)) {
        console.log('[Antigravity] Element is not editable');
        hideTrigger();
        return;
    }

    // Check for sensitive fields
    if (isSensitive(target)) {
        console.log('[Antigravity] Element is sensitive, skipping');
        hideTrigger();
        return;
    }

    activeElement = target;
    console.log('[Antigravity] Active element set');

    // Check if extension is active
    chrome.storage.local.get(['isActive'], (result) => {
        const isActive = result.isActive !== false; // Default to true
        console.log('[Antigravity] Extension active status:', isActive);
        if (isActive) {
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
    // Check for contentEditable
    if (element.isContentEditable) {
        return true;
    }

    // Check for textarea
    if (element.tagName === 'TEXTAREA') {
        return true;
    }

    // Check for input fields with text-based types
    if (element.tagName === 'INPUT') {
        const type = element.type ? element.type.toLowerCase() : 'text';
        const textInputTypes = [
            'text', 'search', 'url', 'tel',
            'email', // We'll filter sensitive emails separately
            'number', 'date', 'datetime-local',
            'month', 'time', 'week'
        ];
        return textInputTypes.includes(type);
    }

    return false;
}

function isSensitive(element) {
    const type = element.type ? element.type.toLowerCase() : '';
    const name = element.name || '';
    const id = element.id || '';
    const autocomplete = element.autocomplete || '';
    const placeholder = element.placeholder || '';

    // Always block password fields
    if (type === 'password') return true;

    // Check autocomplete attribute for sensitive data
    const sensitiveAutocomplete = ['cc-number', 'cc-csc', 'cc-exp', 'current-password', 'new-password'];
    if (sensitiveAutocomplete.some(ac => autocomplete.includes(ac))) return true;

    // Check for sensitive keywords in name, id, and placeholder
    const sensitiveKeywords = [
        'password', 'passwd', 'pwd',
        'credit', 'card', 'cvv', 'cvc', 'ccv',
        'ssn', 'social',
        'secret', 'token', 'key', 'api',
        'pin', 'security',
        'account', 'routing'
    ];

    const identifier = (name + ' ' + id + ' ' + placeholder).toLowerCase();
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
    if (!activeElement) {
        console.log('[Antigravity] No active element');
        return;
    }

    const originalText = activeElement.value || activeElement.innerText || activeElement.textContent;
    if (!originalText || originalText.trim().length === 0) {
        console.log('[Antigravity] No text to correct');
        return;
    }

    console.log('[Antigravity] Correcting text:', originalText.substring(0, 50) + '...');

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

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            const correctedText = data.corrected;

            console.log('[Antigravity] Corrected text:', correctedText);

            if (correctedText && correctedText !== originalText) {
                applyCorrection(correctedText);
                updateStats(originalText.length - correctedText.length);
            } else {
                console.log('[Antigravity] No changes needed');
            }

        } catch (error) {
            console.error('[Antigravity] Error:', error);
            alert('Antigravity Error: ' + error.message + '\n\nMake sure the server is running (python server.py)');
        } finally {
            triggerBtn.classList.remove('antigravity-loading');
        }
    });
}

function applyCorrection(newText) {
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        // For input and textarea elements
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;

        activeElement.value = newText;

        // Restore cursor position at the end
        activeElement.selectionStart = activeElement.selectionEnd = newText.length;

        // Dispatch events for framework compatibility
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (activeElement.isContentEditable) {
        // For contentEditable elements
        activeElement.textContent = newText;

        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(activeElement);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        // Dispatch events
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
