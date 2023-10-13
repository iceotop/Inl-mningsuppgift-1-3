document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the book details from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id"); // Assuming you pass the book ID as a query parameter
    const searchQuery = urlParams.get("q");

    // Fetch book details using the book ID
    fetchBookDetails(bookId);

    document.getElementById("return-results-page").href = `/search-results.html?q=${encodeURIComponent(searchQuery)}`;
});

function fetchBookDetails(bookId) {
    // Make a request to fetch book details using the book ID
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const book = data.volumeInfo;
            const accessInfo = data.accessInfo;

            // Create HTML elements to display book details
            const bookDetailsContainer = document.getElementById("book-details");
            const imgElement = document.createElement("img");
            imgElement.src = book.imageLinks.thumbnail; imgElement.alt = "book cover";
            const titleElement = document.createElement("h2");
            titleElement.textContent = book.title || "Title not available";
            const authorElement = document.createElement("p");
            authorElement.textContent = `Author: ${book.authors ? book.authors.join(", ") : "Unknown"}`;
            const pageCountElement = document.createElement("p");
            pageCountElement.textContent = `Page Count: ${book.pageCount || "N/A"}`;
            const isbnElement = document.createElement("p");
            isbnElement.textContent = `ISBN: ${book.industryIdentifiers ? book.industryIdentifiers[0].identifier : "N/A"}`;
            const publishedByElement = document.createElement("p");
            publishedByElement.textContent = `Published By: ${book.publisher || "N/A"}`;
            const languageElement = document.createElement("p");
            languageElement.textContent = `Language: ${book.language || "N/A"}`;
            const synopsisElement = document.createElement("p");
            synopsisElement.innerHTML = `Synopsis: ${book.description || "Synopsis not available"}`;

            // Check if the preview is available and embeddable
            if (accessInfo.embeddable && (accessInfo.viewability === 'PARTIAL' || accessInfo.viewability === 'ALL_PAGES')) {
                const previewLink = book.previewLink + '&embedded=true';
                imgElement.style.cursor = 'pointer';
                imgElement.title = 'Click to preview';
                imgElement.addEventListener('click', () => {
                    window.open(previewLink, '_blank');
                });
            }

            // Append book details to the container
            bookDetailsContainer.appendChild(imgElement);
            bookDetailsContainer.appendChild(titleElement);
            bookDetailsContainer.appendChild(authorElement);
            bookDetailsContainer.appendChild(pageCountElement);
            bookDetailsContainer.appendChild(isbnElement);
            bookDetailsContainer.appendChild(publishedByElement);
            bookDetailsContainer.appendChild(languageElement);
            bookDetailsContainer.appendChild(synopsisElement);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            // Handle errors here (e.g., display an error message)
        });
}