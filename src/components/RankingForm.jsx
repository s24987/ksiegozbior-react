import ReactModal from "react-modal";
import {useState} from "react";
import BookChoiceList from "./BookChoiceList";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const RankingForm = ({
                         rankingData,
                         setRankingData,
                         addedRankingRecords,
                         setAddedRankingRecords,
                         deletedRankingRecords,
                         setDeletedRankingRecords,
                         updatedRankingRecords,
                         setUpdatedRankingRecords,
                         handleRankingSave,
                         toggleEditView
                     }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [books, setBooks] = useState([]);

    const validationSchema = yup.object().shape({
        rankingTitle: yup.string()
            .min(3, "Tytuł musi mieć co najmniej 3 znaki")
            .max(255, "Tytuł nie może mieć więcej niż 255 znaków")
            .required("Tytuł jest wymagany"),
        books: yup.array().of(
            yup.object().shape({
                recordPosition: yup.number()
                    .positive("Pozycja musi być liczbą większą od zera")
                    .required("Pozycja jest wymagana"),
            })
        ),
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            rankingTitle: rankingData?.rankingTitle || "",
            books: rankingData?.books || [],
        },
    });

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

    const handleRankingRecordDelete = async (deletedRecord) => {
        let isRecordNew = false;
        // search added books
        for (const record of addedRankingRecords) {
            if (record.bookId === deletedRecord.bookId) {
                const updatedList = addedRankingRecords.filter(r => r.bookId !== deletedRecord.bookId);
                setAddedRankingRecords(updatedList);
                isRecordNew = true;
            }
        }

        if (!isRecordNew) {
            setDeletedRankingRecords(prev => ([...prev, deletedRecord]));
        }

        const updatedList = rankingData.books.filter(r => r.bookId !== deletedRecord.bookId);
        rankingData.books = updatedList;
        setRankingData(rankingData);
    }

    const handleRecordPositionChange = async (event, record) => {
        const newPosition = parseInt(event.target.value, 10);

        await setRankingData(prev => ({
            ...prev,
            books: prev.books.map(book =>
                book.bookId === record.bookId ? {...book, recordPosition: newPosition} : book
            )
        }));
        setUpdatedRankingRecords(prev => [...prev, record]);
    };

    const onSubmit = (e) => {
        handleRankingSave();
    }

    return (
        <section className="ranking-box">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" className="title" placeholder="Tytuł rankingu" {...register("rankingTitle")}
                       value={rankingData && rankingData.rankingTitle} onChange={handleTitleChange}/>
                {errors.rankingTitle &&
                    <p className="error-message title-error-message">{errors.rankingTitle.message}</p>}

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
                                <td className="number">
                                    <input type="number" value={book.recordPosition} className="transparent-input"
                                           {...register(`books.${book.bookId}.recordPosition`)}
                                           onChange={(event) => {
                                               handleRecordPositionChange(event, book)
                                           }}/>
                                </td>
                                <td>{book.bookTitle}</td>
                                <td>{book.format === 'paper' ? 'papier' : book.format}</td>
                                <td>{book.author}</td>
                                <td>{book.genre}</td>
                                <td>
                                    <button className="delete" onClick={() => {
                                        handleRankingRecordDelete(book)
                                    }}>Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {errors.books?.some((bookError) => bookError?.recordPosition) && (
                    <p className="error-message">
                        Jedna lub więcej pozycji ma nieprawidłową wartość. Pozycja powinna być liczbą większą od zera.
                    </p>
                )}
                <label htmlFor="numeration_type" className="ranking-box-label">Typ numeracji </label>
                <select id="numeration_type" name="numeration_type">
                    <option value="decimal">Liczby arabskie</option>
                    <option value="roman">Liczby rzymskie</option>
                </select>
                <br/>

                <button onClick={openModal}>Dodaj pozycję</button>
                <button type="submit" className="btn-next">Zapisz ranking</button>
                <button className="btn-next" onClick={onCancel}>Anuluj</button>
                <ReactModal isOpen={isModalOpen}>
                    <BookChoiceList books={books} closeModal={closeModal} handleSubmit={handleRankingRecordSubmit}/>
                </ReactModal>
            </form>
        </section>
    );
};

export default RankingForm;