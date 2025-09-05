const display = document.getElementById("display");
const bar = document.getElementById("bar");
const progress = document.getElementById("progress");
const themeToggle = document.getElementById("themeToggle");

let current = "";
let running = false;

const happyMusic = document.getElementById("happyMusic");
const thinkingSound = document.getElementById("thinkingSound");
const videoOverlay = document.getElementById("videoOverlay");
const cutOffVideo = document.getElementById("cutOffVideo");

let firstClick = false;
function startHappyMusicOnce() {
  if (!firstClick) {
    firstClick = true;
    happyMusic.play().catch(() => console.log("Autoplay blocked until tap"));
  }
}

const messages = [
  "Initializing calculation engine...",
  "Allocating system resources...",
  "Consulting with calculator gods...",
  "Running quantum computing algorithms...",
  "Asking Ramanujan for insights...",
  "Synchronizing with NASA servers...",
  "Optimizing carry-over functions...",
  "Reversing polarity of the digits...",
  "Encrypting and decrypting inputs...",
  "Balancing binary trees...",
  "Checking P vs NP status...",
  "Aligning prime numbers...",
  "Performing imaginary number summits...",
  "Debugging user's math skills...",
  "Cross-verifying with astrology charts...",
  "Accessing hidden decimal places...",
  "Training AI on abacus data...",
  "Quantum entangling the operands...",
  "Simulating 1 billion coin flips...",
  "Extracting square roots by hand...",
  "Negotiating with π for extra digits...",
  "Calibrating the imaginary axis...",
  "Outsourcing computation to interns...",
  "Preparing the wrong answer with confidence...",
  "Finalizing wrong result..."
];

const durationMs = 40_000;
const stepMs = Math.floor(durationMs / messages.length);

function computeCorrect(expr) {
  try { return Function("return " + expr)(); }
  catch { return NaN; }
}

function makeWrong(correct) {
  function longDecimal() {
    let base = Math.floor(Math.random() * 9999) + 1;
    let decimals = Math.random().toString().slice(2, Math.floor(Math.random() * 6) + 2);
    return base + "." + decimals;
  }

  function capLength(val) {
    val = val.toString();
    if (val.length > 14) {
      return val.slice(0, 14);
    }
    return val;
  }

  if (!isFinite(correct) || isNaN(correct)) {
    let weird = longDecimal();
    if (Math.random() < 0.3) weird = "-" + weird;
    if (Math.random() < 0.25) weird = "√" + weird;
    if (Math.random() < 0.2) weird = weird + "i";
    if (Math.random() < 0.25) weird = weird + "e" + (Math.floor(Math.random() * 6) - 3);
    return capLength(weird);
  }

  let wrong = correct + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 999) + 1);
  if (Math.random() < 0.4) wrong *= (Math.random() * 5 + 2);
  if (Math.random() < 0.2) wrong = wrong / (Math.random() * 5 + 1);
  if (Math.random() < 0.3) wrong = "√" + Math.abs(wrong).toFixed(2);
  else if (Math.random() < 0.25) wrong = wrong.toExponential(2);
  else if (Math.random() < 0.3) wrong = wrong.toFixed(6);
  else if (Math.random() < 0.2) wrong = wrong.toFixed(2) + "i";

  return capLength(wrong);
}

function setDisplayText(text, isMessage = false) {
  display.textContent = "";
  const span = document.createElement("div");
  span.textContent = text;
  if (isMessage) span.classList.add("msg");
  display.appendChild(span);
  requestAnimationFrame(() => {
    if (span.scrollWidth > display.clientWidth) {
      span.classList.add("scroll");
    } else {
      span.classList.remove("scroll");
    }
  });
}

function startProcess(expr) {
  running = true;
  setDisplayText("Calculating...", true);
  bar.style.width = "0%";
  progress.style.display = "block";

  happyMusic.pause();
  thinkingSound.currentTime = 0;
  thinkingSound.play();

  const correct = computeCorrect(expr);
  const wrong = makeWrong(correct);
  let index = 0;
  const start = Date.now();

  const timer = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
    bar.style.width = pct + "%";
    if (index < messages.length) {
      setDisplayText(messages[index], true);
      index++;
    }
    if (elapsed >= durationMs) {
      clearInterval(timer);
      running = false;
      setDisplayText(wrong);
      bar.style.width = "100%";

      thinkingSound.pause();
      thinkingSound.currentTime = 0;

      setTimeout(() => {
        videoOverlay.style.display = "flex";
        cutOffVideo.currentTime = 0;
        cutOffVideo.play();

        cutOffVideo.onended = () => {
          videoOverlay.style.display = "none";
          current = "";
          setDisplayText("0");
          happyMusic.play();
        };

        cutOffVideo.onloadedmetadata = () => {
          setTimeout(() => {
            if (!cutOffVideo.paused) {
              videoOverlay.style.display = "none";
              current = "";
              setDisplayText("0");
              happyMusic.play();
            }
          }, cutOffVideo.duration * 1000 + 500);
        };
      }, 400);

      setTimeout(() => { progress.style.display = "none"; }, 1000);
    }
  }, stepMs);
}

// --- Mobile-safe input handling ---
function addInputHandler(btn) {
  let tapped = false;

  function handler(e) {
    if (tapped) return;
    tapped = true;
    setTimeout(() => tapped = false, 300);

    if (videoOverlay.style.display === "flex") return;
    startHappyMusicOnce();

    const action = btn.dataset.action;
    if (running) return;

    if (!isNaN(action)) {
      if (display.textContent === "0" || current === "0") {
        current = action;
      } else {
        current += action;
      }
      setDisplayText(current);

    } else if (action === ".") {
      if (current.length > 0 && /\d$/.test(current)) {
        let parts = current.split(/[\+\-\*\/%]/);
        let lastPart = parts[parts.length - 1];
        if (!lastPart.includes(".")) {
          current += action;
          setDisplayText(current);
        }
      }

    } else if (["+", "-", "*", "/", "%"].includes(action)) {
      if (current.length > 0 && !["+", "-", "*", "/", "%"].includes(current.slice(-1))) {
        current += action;
        setDisplayText(current);
      }

    } else if (action === "clear") {
      current = "";
      setDisplayText("0");
      bar.style.width = "0%";
      progress.style.display = "none";

    } else if (action === "back") {
      current = current.slice(0, -1);
      setDisplayText(current || "0");

    } else if (action === "=") {
      let hasOperator = /[+\-*/%]/.test(current);
      let valid = hasOperator && /\d$/.test(current);
      if (!current || !valid) return;
      startProcess(current);
    }
  }

  btn.addEventListener("click", handler);
  // Removed touchstart to avoid double firing on mobile
}

document.querySelectorAll(".buttons button").forEach(addInputHandler);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
