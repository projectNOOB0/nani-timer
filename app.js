function startTimer() {
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;
  const totalSeconds = minutes * 60 + seconds;
  localStorage.setItem("timer", Date.now() + totalSeconds * 1000);
  window.location.href = "timer.html";
}

function updateCountdown() {
  const countdown = document.getElementById("countdown");
  const endTime = parseInt(localStorage.getItem("timer"));
  const interval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    countdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (remaining <= 0) {
      clearInterval(interval);
      window.location.href = "timesup.html";
    }
  }, 500);
}

if (window.location.pathname.endsWith("timer.html")) {
  updateCountdown();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("Service Worker Error:", err));
}
