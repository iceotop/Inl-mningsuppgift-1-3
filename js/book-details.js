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
            const shorterBookDetailsContainer = document.getElementById("shorter-book-details");
            const longerBookDetailsContainer = document.getElementById("longer-book-details");
            const imgElement = document.createElement("img");
            imgElement.src = book.imageLinks.thumbnail; imgElement.alt = "book cover";
            const titleElement = document.createElement("h2");
            titleElement.textContent = book.title || "Title not available";
            const buttonsContainer = document.createElement('div');

            buttonsContainer.id = 'buttons-container';
            const readButton = document.createElement('button');
            readButton.id = 'read-button';
            readButton.textContent = 'Read';
            const downloadButton = document.createElement('button');
            downloadButton.id = 'download-button';
            downloadButton.textContent = 'Download';

            const authorElement = document.createElement("p");
            authorElement.innerHTML = `<b>Author:</b> ${book.authors ? book.authors.join(", ") : "Unknown"}`;
            const pageCountElement = document.createElement("p");
            pageCountElement.innerHTML = `<b>Page Count:</b> ${book.pageCount || "N/A"}`;
            const isbnElement = document.createElement("p");
            isbnElement.innerHTML = `<b>ISBN:</b> ${book.industryIdentifiers ? book.industryIdentifiers[0].identifier : "N/A"}`;
            const publishedByElement = document.createElement("p");
            publishedByElement.innerHTML = `<b>Published By:</b> ${book.publisher || "N/A"}`;
            const languageElement = document.createElement("p");
            languageElement.innerHTML = `<b>Language:</b> ${book.language ? book.language.toUpperCase() : "N/A"}`;
            const synopsisElement = document.createElement("p");
            synopsisElement.innerHTML = `${book.description || "Synopsis not available"}`;

            // Check if the preview is available and embeddable
            if (accessInfo.embeddable && (accessInfo.viewability === 'PARTIAL' || accessInfo.viewability === 'ALL_PAGES')) {
                const previewLink = book.previewLink + '&embedded=true';
                imgElement.style.cursor = 'pointer';
                imgElement.title = 'Click to preview';
                imgElement.addEventListener('click', () => {
                    window.open(previewLink, '_blank');
                });
            }

            // Append book details to containers
            const imgElementDiv = document.createElement("div");
            imgElementDiv.id = 'img-container';
            imgElementDiv.appendChild(imgElement);

            shorterBookDetailsContainer.appendChild(imgElementDiv);
            shorterBookDetailsContainer.appendChild(titleElement);

            buttonsContainer.appendChild(readButton);
            buttonsContainer.appendChild(downloadButton);
            shorterBookDetailsContainer.appendChild(buttonsContainer);

            shorterBookDetailsContainer.appendChild(authorElement);
            shorterBookDetailsContainer.appendChild(pageCountElement);
            shorterBookDetailsContainer.appendChild(isbnElement);
            shorterBookDetailsContainer.appendChild(publishedByElement);
            shorterBookDetailsContainer.appendChild(languageElement);
            longerBookDetailsContainer.appendChild(synopsisElement);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            // Handle errors here (e.g., display an error message)
        });
}