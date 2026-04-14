# Wordly Dictionary

A clean, single‑page dictionary web app that lets you search for any English word and get its **definition, pronunciation (audio + phonetic), example sentence, synonyms, and source details**. Save favourite words, keep a search history, and enjoy a responsive split‑screen layout.

## Features

- **Search** – type a word and press Enter or click the search button.
- **Audio pronunciation** – listen to the correct pronunciation (where available).
- **Definitions** – part of speech, meaning, example sentence.
- **Synonyms** – up to 5 synonyms per definition.
- **Phonetic transcription** – e.g., `/həˈloʊ/`.
- **Favourites** – save words to localStorage, view them as clickable chips, remove individually, or clear all.
- **Search history** – automatically stores last 10 searches, click any history item to re‑search, delete single entries, or clear all history.
- **Clear search** – one‑click to reset input and results.
- **Back to top** – smooth scroll button in the footer.
- **Responsive** – split‑screen on desktop, stacked on mobile, vertical red line on large screens.
- **Source credit** – “Definitions from Free Dictionary API”.

## Languages Used

- **HTML5** – semantic structure
- **CSS3** – Flexbox/Grid, responsive design, custom styling
- **JavaScript (ES6+)** – `async/await`, DOM manipulation, `localStorage`, event handling
- **API** – [Free Dictionary API](https://dictionaryapi.dev/) (no API key required)

##  Project Structure
wordly-dictionary/
├── index.html
├── style.css
├── script.js
└── images/
├── logo.webp
└── Pocket-Dictionary.webp

##  How to Run

1. Clone or download the repository.
2. Open `index.html` in any modern browser (no build step or server required).
3. Start searching for words!

## Core Functions (JavaScript)

| Function | Purpose |
|----------|---------|
| `searchWord(word)` | Fetches word data from API, displays definitions, synonyms, phonetic text, and audio button. Saves to history. |
| `clearSearch()` | Clears the search input and results area. |
| `saveToFavourites()` | Saves current word to localStorage favourites (no duplicates). |
| `renderFavourites()` | Displays favourites list, allows removal or clicking to search. |
| `clearAllFavourites()` | Removes all favourites. |
| `addToHistory(word)` | Adds word to history (max 10, most recent first, no duplicates). |
| `renderHistoryList()` | Displays history list with delete and click‑to‑search functionality. |
| `setupBackToTop()` | Smooth scroll to top. |
| `restoreLastWord()` | Loads last searched word from localStorage on page load. |

##  Customisation

- **Accent colour** – change `#ff0000` in CSS to any colour you like.
- **History / favourites limit** – modify the `slice(0, 10)` number in `addToHistory()`.
- **API** – replace the endpoint with another dictionary API if desired.

##  License

Free to use for learning and personal projects.

---

**Built with curiosity and persistence.**  
*Keep searching, keep learning.*