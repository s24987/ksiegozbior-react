import {useLoaderData, useOutletContext} from "react-router-dom";

const Statistics = ({isUserLoggedIn}) => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Twoje statystyki");

    const statistics = useLoaderData();

    // if error message
    if (!isUserLoggedIn || typeof statistics.message !== 'undefined') {
        return (
            <h2>Nie jesteś zalogowany.</h2>
        );
    }

    return (
        <section id="statistics">
            <h2>Twoje statystyki</h2>
            <table>
                <tbody>
                <tr>
                    <td>Przeczytane książki</td>
                    <td className="number">{statistics.readBooksCount}</td>
                </tr>
                <tr>
                    <td>Do przeczytania</td>
                    <td className="number">{statistics.unreadBooksCount}</td>
                </tr>
                <tr>
                    <td>Liczba rankingów</td>
                    <td className="number">{statistics.rankingsCount}</td>
                </tr>
                <tr>
                    <td>Liczba recenzji</td>
                    <td className="number">{statistics.reviewsCount}</td>
                </tr>
                </tbody>
            </table>
        </section>
    );
};

export const statisticsLoader = async () => {
    return  fetch('http://localhost:8080/statistics', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export default Statistics;