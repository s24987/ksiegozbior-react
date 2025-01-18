import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/BookDetails.css';

const BookDetails = () => {
    const {bookId} = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/books/${bookId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBook(data);
                } else {
                    setError("Błąd podczas pobierania szczegółów książki");
                    console.log("Błąd podczas pobierania szczegółów książki: " + response);
                }
            } catch (error) {
                console.error("Błąd:", error);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    if (!book && !error) return (<p>Ładowanie szczegółów książki...</p>);
    else if (error) return (<p id="error_summary">{error}</p>)

    return (
        <div className="two-columns">
            <div>
                <img src="https://s.lubimyczytac.pl/upload/books/4923000/4923601/1122658-352x500.jpg"/>
            </div>
            <section className="book-details">
                <h1>{book.title}</h1>
                <h3>{book.author}</h3>
                <p>Gatunek: {book.genre}</p>
                <p>Format: {book.format === 'paper' ? 'papier' : book.format}</p>
                {book.pageCount &&
                    <p>Liczba stron: {book.pageCount}</p>
                }
                {book.listeningLength &&
                    <p>Długość słuchania: {book.listeningLength}</p>
                }
                {book.narrator &&
                    <p>Narrator: {book.narrator}</p>
                }

            </section>
        </div>
    );
};

export default BookDetails;