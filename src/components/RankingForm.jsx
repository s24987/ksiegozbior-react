const RankingForm = ({rankingData, setRankingData}) => {
    const handleTitleChange = (e) => {
        setRankingData(prev => ({
            ...prev,
            rankingTitle: e.target.value
        }))
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
                            <td>{book.format === 'paper'? 'papier' : book.format}</td>
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
        </section>
    );
};

export default RankingForm;