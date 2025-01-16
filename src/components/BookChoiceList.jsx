import BookChoice from "./BookChoice";
import '../styles/Modals.css'

const BookChoiceList = ({books, closeModal, handleSubmit}) => {
    const onFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        closeModal();
        handleSubmit(formData.get("book_choice"));
    }

    return (
        <form className="modal-content" onSubmit={onFormSubmit}>
            <div id="search_results" className="modal-choice-list">
                {books.map(book => (
                    <BookChoice book={book}/>
                ))}
            </div>
            <div className="modal-btn-section">
                <input type="submit" value="Dodaj"/>
                <button onClick={closeModal}>Anuluj</button>
            </div>
        </form>

    );

};

export default BookChoiceList;