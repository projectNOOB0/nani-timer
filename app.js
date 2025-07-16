let timerInterval;
let timerRunning = false;
let timerStopped = false;
let remainingTime = 0;
let totalTime = 0;
let endTime;

// 🌟 Preset selection
function selectPreset(label, minutes) {
  localStorage.removeItem("customTime"); // 🚨 Clear custom time
  localStorage.setItem("presetLabel", label);
  localStorage.setItem("presetMinutes", minutes);
  localStorage.setItem("timerType", label.toLowerCase());
  window.location.href = "preset.html";
}


// 🌟 From preset.html
function startPresetTimer() {
  const label = localStorage.getItem("presetLabel");
  const minutes = parseInt(localStorage.getItem("presetMinutes")) || 0;
  totalTime = minutes * 60;
  remainingTime = totalTime;
  updateDisplay();
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
  localStorage.setItem("timerType", "custom");
  window.location.href = "timer.html";
}

// 🌟 Start countdown
function startCountdown(duration) {
  const countdown = document.getElementById("countdown");
  endTime = Date.now() + duration * 1000;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const now = Date.now();
    remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    countdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      playTimesUpSound();
      window.location.href = "timesup.html";
    }
  }, 500);
}

function updateDisplay() {
  const countdown = document.getElementById("countdown");
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  countdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timerStopped = false;
    endTime = Date.now() + remainingTime * 1000;
    startCountdown(remainingTime);
  }
}

function stopTimer() {
  if (timerRunning && !timerStopped) {
    clearInterval(timerInterval);
    timerStopped = true;
    timerRunning = false;
  } else if (timerStopped) {
    startTimer(); // resume
  }
}

// 🌟 Used in timer.html
if (window.location.pathname.endsWith("timer.html")) {
  const customTime = parseInt(localStorage.getItem("customTime")) || 0;
  const presetMinutes = parseInt(localStorage.getItem("presetMinutes")) || 0;
  const totalSeconds = customTime || presetMinutes * 60 || 0;
  if (totalSeconds > 0) {
    totalTime = totalSeconds;
    remainingTime = totalTime;
    updateDisplay();
  }
}

// 🌟 Go Back
function goBack() {
  window.history.back();
}

// 🌟 Click sound on buttons
const clickSound = new Audio('assets/click.mp3');
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => clickSound.play());
});

// 🌟 Times up sound based on timer type
function playTimesUpSound() {
  const timerType = localStorage.getItem("timerType") || "default";
  const timesUpSound = new Audio(`assets/${timerType}-end.mp3`);
  timesUpSound.play();
}

// 🌟 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("Service Worker Error:", err));
}
