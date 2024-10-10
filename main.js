const bookForm = document.getElementById('bookForm');
const searchBookForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

let books = JSON.parse(localStorage.getItem('books')) || []; // Memuat buku dari Local Storage
let currentEditIndex = null;

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value); // Pastikan year menjadi number
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const book = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  if (currentEditIndex !== null) {
    books[currentEditIndex] = book;
    currentEditIndex = null;
  } else {
    books.push(book);
  }

  localStorage.setItem('books', JSON.stringify(books));
  renderBooks();
  bookForm.reset();
});

searchBookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  renderBooks(searchTerm);
});

function renderBooks(searchTerm = '') {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach((book) => {
    if (book.title.toLowerCase().includes(searchTerm)) {
      const bookElement = document.createElement('div');
      bookElement.setAttribute('data-bookid', book.id);
      bookElement.setAttribute('data-testid', 'bookItem');

      bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
      `;

      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }

      bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
        book.isComplete = !book.isComplete;
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks(searchTerm);
      });

      bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
        books = books.filter(b => b.id !== book.id);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks(searchTerm);
      });
    }
  });
}

renderBooks();