import BookChoice from "./BookChoice";
import '../styles/Modals.css'

const BookChoiceList = ({books, closeModal}) => {

    return (
        <div className="modal-content">
            <div id="search_results" className="modal-choice-list">
                {books.map(book => (
                    <BookChoice book={book}/>
                ))}
            </div>
            <div className="modal-btn-section">
                <button>Dodaj</button>
                <button onClick={closeModal}>Anuluj</button>
            </div>
        </div>
    );

};

export default BookChoiceList;