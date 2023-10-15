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
            data.items.slice(0, 20).forEach(book => {
                const bookID = book.id;
                const coverUrl = book.volumeInfo && book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default-thumbnail.jpg';
                const title = book.volumeInfo.title;
                const year = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : 'N/A';
            
                const bookContainer = document.createElement("a");
                bookContainer.className = 'book-card';
                bookContainer.href = `/details.html?id=${bookID}&q=${encodeURIComponent(searchQuery)}`; 

                const bookImageDiv = document.createElement("div");
                bookImageDiv.className = 'book-image';
                const bookImage = document.createElement("img");
                bookImage.src = coverUrl; 
                bookImage.alt = "cover image";
                bookImageDiv.appendChild(bookImage);

                const bookTitleDiv = document.createElement("div");
                bookTitleDiv.className = 'book-title';
                bookTitleDiv.textContent = title;

                const bookYearDiv = document.createElement("div");
                bookYearDiv.className = 'book-year';
                bookYearDiv.textContent = year;

                bookContainer.appendChild(bookImageDiv);
                bookContainer.appendChild(bookTitleDiv);
                bookContainer.appendChild(bookYearDiv);

                document.getElementById("book-list").appendChild(bookContainer);

            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

//------------------REVEAL CATEGORY MENU------------------//
document.getElementById('toggle-btn').addEventListener('click', function() {
    var menu = document.getElementById('category-menu');
    menu.classList.toggle('open');

    if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      } else {
        document.body.classList.add('menu-open');
      }

});

//------------------SELECT CATEGORY(/-IES)------------------//
document.querySelectorAll('#category-menu ul li a').forEach(item => {
    item.addEventListener('click', event => {
        event.currentTarget.classList.toggle('selected');
        // Save state to localStorage
        localStorage.setItem(event.currentTarget.textContent, event.currentTarget.classList.contains('selected'));
    });
    // Load state from localStorage on page load
    const isSelected = localStorage.getItem(item.textContent);
    if (isSelected === 'true') {
        item.classList.add('selected');
    }
});

//------------------CHOOSE BETWEEN SHELF OR HEAP------------------//
const shelfBtn = document.getElementById('shelf-btn');
const heapBtn = document.getElementById('heap-btn');

// Load Shelf/Heap choice from localStorage on page load
const shelfHeapChoice = localStorage.getItem('shelfHeapChoice');
if (shelfHeapChoice) {
    shelfBtn.classList.toggle('chosen', shelfHeapChoice === 'shelf');
    heapBtn.classList.toggle('chosen', shelfHeapChoice === 'heap');
} else {
    shelfBtn.classList.add('chosen');
}

shelfBtn.addEventListener('click', function() {
    this.classList.add('chosen');
    heapBtn.classList.remove('chosen');
    // Save choice to localStorage
    localStorage.setItem('shelfHeapChoice', 'shelf');
});

heapBtn.addEventListener('click', function() {
    this.classList.add('chosen');
    shelfBtn.classList.remove('chosen');
    // Save choice to localStorage
    localStorage.setItem('shelfHeapChoice', 'heap');
});

//------------------CLEAR ON PAGE SWITCH TO INDEX------------------//
window.addEventListener('beforeunload', function() {
    localStorage.setItem('lastPage', window.location.href);
});