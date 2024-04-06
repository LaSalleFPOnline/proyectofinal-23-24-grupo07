// Evento detecta Enter
document.getElementById('search-button').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        showSearchResults();
    }
});

function showSearchResults() {
    let searchResults = document.getElementById("searchResults");

    // Mostramos los resultados cambiando su estilo a 'block'
    searchResults.style.display = "block";
}