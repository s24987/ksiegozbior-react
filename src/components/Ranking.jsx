const Ranking = ({rankingData}) => {
    return (
        <>
            <p className="title">{rankingData.rankingTitle}</p>
            <ol className={rankingData.numerationType}>
                {rankingData.books && rankingData.books.length > 0 && rankingData.books.map(book => (
                    <li>{book.bookTitle}, {book.author}</li>
                ))}
            </ol>
        </>
    );
};

export default Ranking;