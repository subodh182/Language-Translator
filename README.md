# ⬡ LinguaFlow — Language Translation Web App

A professional, full-featured language translation web application built with **Flask** (Python) and a modern, custom-designed frontend.

---

## ✨ Features

- 🌐 **100+ Languages** — Powered by Google Translate (unofficial API, no key required)
- 🔍 **Auto Language Detection** — Detect the source language automatically
- ⚡ **Auto-Translate Mode** — Translates as you type (debounced 900ms)
- 🔊 **Text-to-Speech** — Listen to source or translated text via Web Speech API
- 📋 **Paste & Copy** — One-click clipboard integration
- 🔄 **Swap Languages** — Instantly swap source/target with text
- 🎨 **Quick Language Chips** — Fast-pick popular languages
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## 🎨 Design

| Attribute      | Value                              |
|----------------|------------------------------------|
| Theme          | Dark — Deep Obsidian               |
| Primary Color  | Electric Teal `#00d4c8`            |
| Accent Color   | Amber Gold `#f5a623`               |
| Danger Color   | Rose `#ff6b8a`                     |
| Display Font   | Syne (Google Fonts)                |
| Body Font      | DM Sans (Google Fonts)             |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# 1. Clone or unzip the project
cd linguaflow

# 2. Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the Flask app
python app.py
```

### Open in browser
```
http://localhost:5000
```

---

## 📁 Project Structure

```
linguaflow/
├── app.py                  # Flask application & translation API
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── templates/
│   └── index.html          # Main HTML template (Jinja2)
└── static/
    ├── css/
    │   └── style.css       # All styles (CSS variables, animations)
    └── js/
        └── main.js         # Frontend logic (translate, TTS, swap, copy)
```

---

## 🔌 API Endpoints

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | `/`           | Renders the main translation UI      |
| POST   | `/translate`  | Translates text (JSON body required) |
| GET    | `/languages`  | Returns all supported languages      |

### POST `/translate` — Request Body
```json
{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "fr"
}
```

### POST `/translate` — Response
```json
{
  "translation": "Bonjour, comment allez-vous ?",
  "source": "en",
  "target": "fr"
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut         | Action               |
|------------------|----------------------|
| `Ctrl + Enter`   | Translate now        |
| `Escape`         | Close modal          |

---

## 🌍 Supported Languages (sample)

Afrikaans, Albanian, Arabic, Armenian, Bengali, Bosnian, Bulgarian, Chinese (Simplified & Traditional), Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Maltese, Nepali, Norwegian, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Serbian, Slovak, Slovenian, Somali, Spanish, Swahili, Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, Vietnamese, Welsh, and many more.

---

## ⚠️ Notes

- This app uses **Google Translate's unofficial API** — no API key required, but it's subject to rate limiting for very high traffic.
- For production use, consider integrating the official **Google Cloud Translation API** or **DeepL API**.
- Text input is limited to **5,000 characters** per request.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ using Flask, Python, HTML, CSS & Vanilla JS*
