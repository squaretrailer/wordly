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

    resultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await response.json();

        if (data.title === "No Definitions Found") {
            resultsDiv.innerHTML = `<p>No definition found for "<strong>${word}</strong>". Please check spelling.</p>`;
            return;
        }

        // Display definitions
        let html = `<h3>${word}</h3>`;
        data[0].meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            const definition = meaning.definitions[0].definition;
            const example = meaning.definitions[0].example ? `<br><em>Example: ${meaning.definitions[0].example}</em>` : '';
            html += `<p><strong>${partOfSpeech}</strong>: ${definition}${example}</p>`;
        });
        resultsDiv.innerHTML = html;

        console.log("Fetch successful");
    } catch (err) {
        resultsDiv.innerHTML = '<p>Error fetching definition. Try again later.</p>';
        console.error(err);
    }
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

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchQuery');
    if (searchBtn) searchBtn.addEventListener('click', searchWord);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchWord();
        });
    }
    setupBackToTop();
});