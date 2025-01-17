import BookChoice from "./BookChoice";
import '../styles/Modals.css'
import {useState} from "react";

const BookChoiceList = ({books, closeModal, handleSubmit}) => {
    const [bookChoice, setBookChoice] = useState(null);
    const onFormSubmit = (e) => {
        e.preventDefault();
        if (bookChoice != null)
            handleSubmit(bookChoice);
        else
            alert('Wybierz książkę');
    }

    return (
        <form className="modal-content" onSubmit={onFormSubmit}>
            <div id="search_results" className="modal-choice-list">
                {books.map(book => (
                    <BookChoice book={book} setBookChoice={setBookChoice}/>
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