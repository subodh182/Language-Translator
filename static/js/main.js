/* LinguaFlow – Main JS */
"use strict";

const sourceText   = document.getElementById("sourceText");
const targetText   = document.getElementById("targetText");
const sourceLang   = document.getElementById("sourceLang");
const targetLang   = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const swapBtn      = document.getElementById("swapBtn");
const clearBtn     = document.getElementById("clearBtn");
const pasteBtn     = document.getElementById("pasteBtn");
const copyBtn      = document.getElementById("copyBtn");
const speakSource  = document.getElementById("speakSource");
const speakTarget  = document.getElementById("speakTarget");
const charCount    = document.getElementById("charCount");
const targetInfo   = document.getElementById("targetInfo");
const errorBanner  = document.getElementById("errorBanner");
const autoToggle   = document.getElementById("autoTranslate");
const btnLoader    = document.getElementById("btnLoader");
const toast        = document.getElementById("toast");

let autoTimer  = null;
let lastResult = "";

// ── Toast ────────────────────────────────
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// ── Error ────────────────────────────────
function showError(msg) {
  errorBanner.textContent = "⚠ " + msg;
  errorBanner.style.display = "block";
  setTimeout(() => errorBanner.style.display = "none", 4000);
}
function clearError() { errorBanner.style.display = "none"; }

// ── Char Count ───────────────────────────
sourceText.addEventListener("input", () => {
  const len = sourceText.value.length;
  charCount.textContent = `${len} / 5000`;
  charCount.style.color = len > 4500 ? "var(--rose)" : "var(--text-3)";

  if (autoToggle.checked) {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(translate, 900);
  }
});

// ── Translate ─────────────────────────────
async function translate() {
  const text = sourceText.value.trim();
  if (!text) {
    targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
    targetInfo.textContent = "";
    return;
  }

  clearError();
  translateBtn.classList.add("loading");
  targetText.classList.add("loading");

  try {
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        source: sourceLang.value,
        target: targetLang.value,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      showError(data.error || "Translation failed. Please try again.");
      targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
      return;
    }

    lastResult = data.translation;
    targetText.textContent = data.translation;

    const langName = targetLang.options[targetLang.selectedIndex].text;
    targetInfo.textContent = `→ ${langName}`;

  } catch (err) {
    showError("Network error. Is Flask running?");
  } finally {
    translateBtn.classList.remove("loading");
    targetText.classList.remove("loading");
  }
}

translateBtn.addEventListener("click", translate);

// Enter key shortcut (Ctrl/Cmd + Enter)
sourceText.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") translate();
});

// ── Swap ──────────────────────────────────
swapBtn.addEventListener("click", () => {
  if (sourceLang.value === "auto") {
    showToast("Select a source language first to swap.", "error");
    return;
  }
  const tempLang = sourceLang.value;
  const tempText = sourceText.value;

  sourceLang.value = targetLang.value;
  targetLang.value = tempLang;
  sourceText.value = lastResult;
  targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
  lastResult = "";

  charCount.textContent = `${sourceText.value.length} / 5000`;
  if (autoToggle.checked && sourceText.value.trim()) translate();
});

// ── Clear ─────────────────────────────────
clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
  charCount.textContent = "0 / 5000";
  targetInfo.textContent = "";
  lastResult = "";
  clearError();
  sourceText.focus();
});

// ── Paste ─────────────────────────────────
pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    sourceText.value = text.slice(0, 5000);
    charCount.textContent = `${sourceText.value.length} / 5000`;
    showToast("Text pasted!");
    if (autoToggle.checked && sourceText.value.trim()) translate();
  } catch {
    showToast("Paste permission denied. Use Ctrl+V.", "error");
  }
});

// ── Copy ──────────────────────────────────
copyBtn.addEventListener("click", async () => {
  if (!lastResult) { showToast("Nothing to copy.", "error"); return; }
  try {
    await navigator.clipboard.writeText(lastResult);
    showToast("Copied to clipboard!");
  } catch {
    showToast("Copy failed.", "error");
  }
});

// ── Text-to-Speech ────────────────────────
function speak(text, langCode) {
  if (!text) { showToast("Nothing to read.", "error"); return; }
  if (!window.speechSynthesis) { showToast("TTS not supported.", "error"); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode === "auto" ? "en" : langCode;
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
}

speakSource.addEventListener("click", () => {
  speakSource.classList.toggle("speaking");
  speak(sourceText.value, sourceLang.value);
  setTimeout(() => speakSource.classList.remove("speaking"), 3000);
});

speakTarget.addEventListener("click", () => {
  speakTarget.classList.toggle("speaking");
  speak(lastResult, targetLang.value);
  setTimeout(() => speakTarget.classList.remove("speaking"), 4000);
});

// ── Quick Language Chips ──────────────────
document.querySelectorAll(".lang-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".lang-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    targetLang.value = chip.dataset.lang;
    if (sourceText.value.trim()) translate();
  });
});

// sync chip highlight on select change
targetLang.addEventListener("change", () => {
  document.querySelectorAll(".lang-chip").forEach(c => {
    c.classList.toggle("active", c.dataset.lang === targetLang.value);
  });
});

// ── Info Modal ────────────────────────────
window.showInfo = () => document.getElementById("modalOverlay").classList.add("active");
window.hideInfo = () => document.getElementById("modalOverlay").classList.remove("active");

// Keyboard close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.hideInfo();
});

// Init chip state
document.querySelectorAll(".lang-chip").forEach(c => {
  if (c.dataset.lang === targetLang.value) c.classList.add("active");
});
