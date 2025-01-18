import ReactModal from "react-modal";
import {useState} from "react";
import BookChoiceList from "./BookChoiceList";

const RankingForm = ({
                         rankingData,
                         setRankingData,
                         addedRankingRecords,
                         setAddedRankingRecords,
                         deletedRankingRecords,
                         setDeletedRankingRecords,
                         handleRankingSave,
                         toggleEditView
                     }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [books, setBooks] = useState([]);

    const handleTitleChange = (e) => {
        setRankingData(prev => ({
            ...prev,
            rankingTitle: e.target.value
        }))
    }

    const openModal = async () => {
        try {
            const response = await fetch('http://localhost:8080/books');

            if (!response.ok) {
                const err = await response.json();
                console.log(err.message || 'Błąd podczas ładowania książek.');
            }

            const allBooks = await response.json();
            setBooks(allBooks);
            setIsModalOpen(true);
        } catch (e) {
            console.log('Błąd podczas ładowania książek: ' + e);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const onCancel = async () => {
        setAddedRankingRecords([]);
        setDeletedRankingRecords([]);
        toggleEditView();
    }

    const handleRankingRecordSubmit = async (book) => {
        console.log(book);
        if (book == null) {
            alert('Książka nie została wybrana');
        }

        // search ranking books to see if it's a new record
        for (const record of rankingData.books) {
            if (record.bookId === book.id) {
                alert('This book is already in the ranking!');
                return;
            }
        }

        // if new, add to list
        const rankingRecord = {
            bookId: book.id,
            recordPosition: 1,
            bookTitle: book.title,
            format: book.format,
            author: book.author,
            genre: book.genre
        };

        setAddedRankingRecords(prev => ([...prev, rankingRecord]));
        rankingData.books.push(rankingRecord);
        rankingData.books.sort((b1, b2) => b1.recordPosition - b2.recordPosition);
        setRankingData(rankingData);

        setIsModalOpen(false);
    }

    return (
        <section className="ranking-box">
            <input type="text" className="title" placeholder="Tytuł rankingu"
                   value={rankingData && rankingData.rankingTitle} onChange={handleTitleChange}/>
            <br/>
            {rankingData && rankingData.books.length > 0 && (
                <table>
                    <tbody>
                    <tr>
                        <th>Pozycja</th>
                        <th>Tytuł</th>
                        <th>Format</th>
                        <th>Autor</th>
                        <th>Gatunek</th>
                        <th></th>
                    </tr>
                    {rankingData.books.map(book => (
                        <tr>
                            <td className="number">{book.recordPosition}</td>
                            <td>{book.bookTitle}</td>
                            <td>{book.format === 'paper' ? 'papier' : book.format}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>
                                <button className="delete">Usuń</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <label htmlFor="numeration_type" className="ranking-box-label">Typ numeracji </label>
            <select id="numeration_type" name="numeration_type">
                <option value="decimal">Liczby arabskie</option>
                <option value="roman">Liczby rzymskie</option>
            </select>
            <br/>

            <button onClick={openModal}>Dodaj pozycję</button>
            <button className="btn-next" onClick={handleRankingSave}>Zapisz ranking</button>
            <button className="btn-next" onClick={onCancel}>Anuluj</button>
            <ReactModal isOpen={isModalOpen}>
                <BookChoiceList books={books} closeModal={closeModal} handleSubmit={handleRankingRecordSubmit}/>
            </ReactModal>
        </section>
    );
};

export default RankingForm;