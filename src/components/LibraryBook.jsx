const LibraryBook = ({isUserLoggedIn, isUserAdmin, book}) => {
    let bookFormat = book.format;
    if (book.format === "paper")
        bookFormat = "papier";
return (
    <section className="middle-section">
        <img src="https://s.lubimyczytac.pl/upload/books/4923000/4923601/1122658-352x500.jpg"/>
        <div>
            <h2>
                <a href="/">{book.title}</a>
            </h2>
            <h4>{book.author}</h4>
            <p>Format: {bookFormat}</p>
            <p>Gatunek: {book.genre}</p>
        </div>
        {isUserLoggedIn && isUserAdmin && <button className="lib-btn-delete">Usuń z biblioteki</button>}
    </section>
);
};

export default LibraryBook;