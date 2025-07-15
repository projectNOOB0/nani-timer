let timerInterval;

// 🌟 Preset selection
function selectPreset(label, minutes) {
  localStorage.setItem("presetLabel", label);
  localStorage.setItem("presetMinutes", minutes);
  window.location.href = "preset.html";
}

// 🌟 From preset.html
function startPresetTimer() {
  const label = localStorage.getItem("presetLabel");
  const minutes = parseInt(localStorage.getItem("presetMinutes")) || 0;
  const totalSeconds = minutes * 60;
  startCountdown(totalSeconds);
  document.getElementById("preset-name").textContent = label + " Timer";
}

// 🌟 From custom.html
function saveCustomTime() {
  const minutes = parseInt(document.getElementById("custom-minutes").value) || 0;
  const seconds = parseInt(document.getElementById("custom-seconds").value) || 0;
  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) {
    alert("Enter valid time.");
    return;
  }
  localStorage.setItem("customTime", totalSeconds);
  window.location.href = "timer.html";
}

// 🌟 Start countdown
function startCountdown(totalSeconds) {
  const countdown = document.getElementById("countdown");
  const endTime = Date.now() + totalSeconds * 1000;
  localStorage.setItem("timer", endTime);

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    countdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      window.location.href = "timesup.html";
    }
  }, 500);
}

// 🌟 Used in timer.html
if (window.location.pathname.endsWith("timer.html")) {
  const customTime = parseInt(localStorage.getItem("customTime")) || 0;
  const presetMinutes = parseInt(localStorage.getItem("presetMinutes")) || 0;
  const totalSeconds = customTime || presetMinutes * 60 || 0;
  if (totalSeconds > 0) startCountdown(totalSeconds);
}

// 🌟 Stop timer
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

// 🌟 Go Back
function goBack() {
  window.history.back();
}

// 🌟 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("Service Worker Error:", err));
}
