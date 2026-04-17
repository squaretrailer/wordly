// DICTIONARY API SEARCH
async function searchWord(optionalWord) {
    const input = document.getElementById('searchQuery');
    let word = optionalWord;
    if (!word) {
        if (!input) return;
        word = input.value.trim();
    } else {
        if (input) input.value = word;
    }
    const resultsDiv = document.getElementById('searchResults');

    if (!word) {
        resultsDiv.innerHTML = '<p>Please enter a word.</p>';
        return;
    }

    localStorage.setItem('lastWord', word);
    resultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await response.json();

        if (data.title === "No Definitions Found") {
            resultsDiv.innerHTML = `<p>No definition found for "<strong>${word}</strong>". Please check spelling.</p>`;
            return;
        }

        let audioUrl = '';
        let phoneticText = '';
        if (data[0].phonetics && data[0].phonetics.length) {
            const audioPhonetic = data[0].phonetics.find(p => p.audio && p.audio.trim() !== '');
            if (audioPhonetic) audioUrl = audioPhonetic.audio;
            const textPhonetic = data[0].phonetics.find(p => p.text && p.text.trim() !== '');
            if (textPhonetic) phoneticText = textPhonetic.text;
        }

        let html = `<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <h2 style="margin:0;">${word}</h2>`;
        if (phoneticText) html += `<span style="font-size:1.4rem; color:#555;">${phoneticText}</span>`;
        if (audioUrl) html += `<button id="playAudioBtn" style="background:none; border:none; font-size:2rem; cursor:pointer;" aria-label="Play pronunciation">🔊</button>`;
        html += `</div>`;

        data[0].meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            const definition = meaning.definitions[0].definition;
            const example = meaning.definitions[0].example ? `<br><em>Example: ${meaning.definitions[0].example}</em>` : '';
            let synonyms = meaning.definitions[0].synonyms;
            let synonymsHtml = '';
            if (synonyms && synonyms.length > 0) {
                synonymsHtml = `<p><strong>Synonyms:</strong> ${synonyms.slice(0, 5).join(', ')}</p>`;
            }
            html += `<div style="margin-bottom: 1.5rem;">
                        <p><strong>${partOfSpeech}</strong>: ${definition}${example}</p>
                        ${synonymsHtml}
                    </div>`;
        });
        html += `<p style="font-size:1.2rem; color:#666;">📖 Definitions from Free Dictionary API</p>`;
        resultsDiv.innerHTML = html;

        if (audioUrl) {
            const playBtn = document.getElementById('playAudioBtn');
            if (playBtn) {
                const newBtn = playBtn.cloneNode(true);
                playBtn.parentNode.replaceChild(newBtn, playBtn);
                newBtn.addEventListener('click', () => {
                    const audio = new Audio(audioUrl);
                    audio.play().catch(e => console.log('Audio play failed:', e));
                });
            }
        }

        addToHistory(word);
        console.log("Fetch successful");
    } catch (err) {
        resultsDiv.innerHTML = '<p>Error fetching definition. Try again later.</p>';
        console.error(err);
    }
}

// CLEAR SEARCH
function clearSearch() {
    const input = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('searchResults');
    if (input) input.value = '';
    if (resultsDiv) resultsDiv.innerHTML = '<p>Your results will appear here.</p>';
}


// FAVOURITES MANAGEMENT (with display)
function getFavourites() {
    return JSON.parse(localStorage.getItem('favourites') || '[]');
}

function saveFavourites(favourites) {
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

function renderFavourites() {
    const container = document.getElementById('favourites-list');
    const clearBtn = document.getElementById('clearFavBtn');
    if (!container) return;
    const favourites = getFavourites();

    if (favourites.length === 0) {
        container.innerHTML = '<p class="placeholder">No favourites saved yet.</p>';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }

    if (clearBtn) clearBtn.style.display = 'block';
    container.innerHTML = '';
    favourites.forEach(word => {
        const div = document.createElement('div');
        div.className = 'fav-item';
        div.innerHTML = `
            <span>${word}</span>
            <button class="remove-fav" data-word="${word}" aria-label="Remove favourite">✖</button>
        `;
        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-fav')) return;
            searchWord(word);
        });
        container.appendChild(div);
    });

    document.querySelectorAll('.remove-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.getAttribute('data-word');
            let favourites = getFavourites();
            favourites = favourites.filter(w => w !== word);
            saveFavourites(favourites);
            renderFavourites();
        });
    });
}

function saveToFavourites() {
    const input = document.getElementById('searchQuery');
    if (!input) return;
    const word = input.value.trim();
    if (!word) {
        alert('No word to save. Please search for a word first.');
        return;
    }
    let favourites = getFavourites();
    const normalizedWord = word.toLowerCase();
    if (favourites.includes(normalizedWord)) {
        alert(`"${word}" is already in your favourites.`);
        return;
    }
    favourites.push(normalizedWord);
    saveFavourites(favourites);
    renderFavourites();
    alert(`"${word}" saved to favourites!`);
}

function clearAllFavourites() {
    if (confirm('Remove all favourites?')) {
        saveFavourites([]);
        renderFavourites();
    }
}

// SEARCH HISTORY (localStorage, max 10)

let historyList = document.getElementById('history-list');

function saveHistoryToStorage(history) {
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function loadHistoryFromStorage() {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
}

function addToHistory(word) {
    let history = loadHistoryFromStorage();
    history = history.filter(item => item !== word);
    history.unshift(word);
    history = history.slice(0, 10);
    saveHistoryToStorage(history);
    renderHistoryList();
}

function renderHistoryList() {
    if (!historyList) return;
    const history = loadHistoryFromStorage();
    historyList.innerHTML = '';
    history.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            searchWord(word);
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = '✖';
        delBtn.style.marginLeft = '0.5rem';
        delBtn.style.background = 'none';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.style.color = '#999';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let history = loadHistoryFromStorage();
            history = history.filter(item => item !== word);
            saveHistoryToStorage(history);
            renderHistoryList();
        });
        li.appendChild(delBtn);
        historyList.appendChild(li);
    });

    const clearBtn = document.getElementById('clearHistoryBtn');
    if (!clearBtn && history.length > 0) {
        const btn = document.createElement('button');
        btn.id = 'clearHistoryBtn';
        btn.textContent = 'Clear All History';
        btn.style.marginTop = '0.5rem';
        btn.style.padding = '0.3rem 0.8rem';
        btn.style.fontSize = '0.8rem';
        btn.addEventListener('click', () => {
            saveHistoryToStorage([]);
            renderHistoryList();
        });
        historyList.parentNode.appendChild(btn);
    } else if (clearBtn && history.length === 0) {
        clearBtn.remove();
    }
}


// BACK TO TOP

function setupBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}


// RESTORE LAST SEARCHED WORD
function restoreLastWord() {
    const lastWord = localStorage.getItem('lastWord');
    if (lastWord) {
        const input = document.getElementById('searchQuery');
        if (input) input.value = lastWord;
    }
}

// INITIALIZE EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchQuery');
    if (searchBtn) searchBtn.addEventListener('click', () => searchWord());
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchWord();
        });
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);

    const saveBtn = document.getElementById('saveFavBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveToFavourites);

    const clearFavBtn = document.getElementById('clearFavBtn');
    if (clearFavBtn) clearFavBtn.addEventListener('click', clearAllFavourites);

    setupBackToTop();
    restoreLastWord();

    historyList = document.getElementById('history-list');
    renderHistoryList();
    renderFavourites();
});