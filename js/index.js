document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const coloredText = document.getElementById("colored-text");

    localStorage.clear();

    searchForm.addEventListener("submit", event => {
        event.preventDefault();  // Prevent the default form submission behavior
        
        const searchQuery = searchInput.value;
        
        if (searchQuery) {
            window.location.href = `/Inl-mningsuppgift-1-3/search-results.html?q=${encodeURIComponent(searchQuery)}`;
        }
    });

    searchInput.addEventListener("input", () => {
        let coloredInput = '';

        for(let i = 0; i < searchInput.value.length; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
            coloredInput += `<span style="color:${color}">${searchInput.value[i]}</span>`;
        }

        searchInput.style.color = 'transparent';
        searchInput.style.backgroundImage = `linear-gradient(to left, transparent ${searchInput.value.length}ch, white ${searchInput.value.length}ch)`;
        searchInput.style.backgroundClip = 'text';
        coloredText.innerHTML = coloredInput;
    });
});