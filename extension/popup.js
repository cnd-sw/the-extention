document.addEventListener('DOMContentLoaded', () => {
  const serverStatus = document.getElementById('server-status');
  const toggleActive = document.getElementById('toggle-active');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const correctionsCount = document.getElementById('corrections-count');
  const savedWords = document.getElementById('saved-words');

  // Load saved settings
  chrome.storage.local.get(['isActive', 'mode', 'stats'], (result) => {
    if (result.isActive !== undefined) {
      toggleActive.checked = result.isActive;
    }

    if (result.mode) {
      updateModeUI(result.mode);
    }

    if (result.stats) {
      correctionsCount.textContent = result.stats.corrections || 0;
      savedWords.textContent = result.stats.savedWords || 0;
    }
  });

  // Check server status
  checkServer();
  setInterval(checkServer, 5000);

  // Toggle Active
  toggleActive.addEventListener('change', () => {
    const isActive = toggleActive.checked;
    chrome.storage.local.set({ isActive });
  });

  // Mode Selection
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      updateModeUI(mode);
      chrome.storage.local.set({ mode });
    });
  });

  function updateModeUI(activeMode) {
    modeBtns.forEach(btn => {
      if (btn.dataset.mode === activeMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  async function checkServer() {
    try {
      // Just a simple fetch to see if it responds
      // Since we don't have a dedicated health endpoint, we can try POSTing empty or just assume if it connects it's up.
      // But let's add a health check to server.py or just try to connect.
      // We'll try to fetch a non-existent endpoint or just assume 404 is "up".
      // Or better, let's add a health check to server.py.
      // For now, let's try to fetch root.
      const response = await fetch('http://localhost:5001/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '' })
      });

      if (response.ok) {
        serverStatus.classList.remove('offline');
        serverStatus.classList.add('online');
        serverStatus.title = "Server Online";
      } else {
        throw new Error('Server error');
      }
    } catch (e) {
      serverStatus.classList.remove('online');
      serverStatus.classList.add('offline');
      serverStatus.title = "Server Offline (Run server.py)";
    }
  }
});
