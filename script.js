// Dictionary API search
async function searchWord() {
    const input = document.getElementById('searchQuery');
    if (!input) return;
    const word = input.value.trim();
    const resultsDiv = document.getElementById('searchResults');

    if (!word) {
        resultsDiv.innerHTML = '<p>Please enter a word.</p>';
        return;
    }

    // Save last searched word to localStorage
    localStorage.setItem('lastWord', word);

    resultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await response.json();

        if (data.title === "No Definitions Found") {
            resultsDiv.innerHTML = `<p>No definition found for "<strong>${word}</strong>". Please check spelling.</p>`;
            return;
        }

        // Find audio URL
        let audioUrl = '';
        let phoneticText = '';
        if (data[0].phonetics && data[0].phonetics.length) {
            const audioPhonetic = data[0].phonetics.find(p => p.audio && p.audio.trim() !== '');
            if (audioPhonetic) audioUrl = audioPhonetic.audio;
            const textPhonetic = data[0].phonetics.find(p => p.text && p.text.trim() !== '');
            if (textPhonetic) phoneticText = textPhonetic.text;
        }

        // Build HTML header with audio button
        let html = `<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <h2 style="margin:0;">${word}</h2>`;
        if (phoneticText) {
            html += `<span style="font-size:1.4rem; color:#555;">${phoneticText}</span>`;
        }
        if (audioUrl) {
            html += `<button id="playAudioBtn" style="background:none; border:none; font-size:2rem; cursor:pointer;" aria-label="Play pronunciation">🔊</button>`;
        }
        html += `</div>`;

        // Loop through meanings
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

        // Attach audio play event
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

        console.log("Fetch successful");
    } catch (err) {
        resultsDiv.innerHTML = '<p>Error fetching definition. Try again later.</p>';
        console.error(err);
    }
}

// Clear button: reset input and clear results
function clearSearch() {
    const input = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('searchResults');
    if (input) input.value = '';
    if (resultsDiv) resultsDiv.innerHTML = '<p>Your results will appear here.</p>';
    // Optionally remove localStorage item? Keep it, but user may want to clear.
}

// Back to Top button
function setupBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Restore last searched word from localStorage on page load
function restoreLastWord() {
    const lastWord = localStorage.getItem('lastWord');
    if (lastWord) {
        const input = document.getElementById('searchQuery');
        if (input) {
            input.value = lastWord;
            // Optionally auto-search? Better to let user decide. Just restore value.
        }
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchQuery');
    const clearBtn = document.getElementById('clearBtn');
    
    if (searchBtn) searchBtn.addEventListener('click', searchWord);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchWord();
        });
    }
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    
    setupBackToTop();
    restoreLastWord();  // put last searched word into input box (doesn't auto-search)
});