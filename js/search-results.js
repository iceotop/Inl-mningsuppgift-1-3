document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("q");

    function errorMessage() {// Handle the case where no results were found
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found.";
        document.getElementById("book-list").appendChild(noResultsMessage);
    }

    if (searchQuery === null) return errorMessage();

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if there are items in the response
            if (data.items && data.items.length > 0) {
                // Iterate through the items and display the first 20 results
                for (let i = 0; i < Math.min(data.items.length, 20); i++) {
                    const book = data.items[i];
                    const bookID = book.id; // Use 'id' property to get the book's unique identifier
                    const coverUrl = book.volumeInfo && book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default-thumbnail.jpg';
                    const title = book.volumeInfo.title;
                    const year = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : 'N/A';

                    // Create elements for each book and add them to the HTML
                    const bookContainer = document.createElement("div");
                    const bookContainerLink = document.createElement("a");
                    const bookImage = document.createElement("img");
                    const bookTitle = document.createElement("p");
                    const bookYear = document.createElement("p");

                    bookContainerLink.href = `/details.html?id=${bookID}&q=${encodeURIComponent(searchQuery)}`; // Use 'id' in the query parameter
                    bookImage.src = coverUrl; bookImage.alt = "cover image";
                    bookTitle.textContent = title;
                    bookYear.textContent = `${year}`;

                    bookContainerLink.appendChild(bookImage);
                    bookContainerLink.appendChild(bookTitle);
                    bookContainerLink.appendChild(bookYear);
                    bookContainer.appendChild(bookContainerLink);

                    document.getElementById("book-list").appendChild(bookContainer);
                }
            } else {
                // Handle the case where no results were found
                errorMessage()
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

document.getElementById('toggle-btn').addEventListener('click', function() {
    var menu = document.getElementById('category-menu');
    menu.classList.toggle('open');

    if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      } else {
        document.body.classList.add('menu-open');
      }

});

document.querySelector('#shelf-btn').addEventListener('click', function() {
    this.classList.toggle('chosen');
});

document.querySelector('#heap-btn').addEventListener('click', function() {
    this.classList.toggle('chosen');
});