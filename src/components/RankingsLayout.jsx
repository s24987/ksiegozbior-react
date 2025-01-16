import {useLoaderData, useOutletContext, useRevalidator} from "react-router-dom";
import {useState} from "react";
import RankingForm from "./RankingForm";
import RankingsList from "./RankingsList";
import '../styles/Ranking.css';

const RankingsLayout = ({isUserLoggedIn}) => {
    const revalidator = useRevalidator();
    const [setHeaderTitle] = useOutletContext();
    let rankings = useLoaderData();
    setHeaderTitle("Twoje rankingi");
    const [isEditView, setIsEditView] = useState(false);
    const [rankingToEdit, setRankingToEdit] = useState(null);

    const toggleView = () => {
        setIsEditView((prev) => !prev);
        if (!isEditView)
            setRankingToEdit(null);
    };

    const handleRankingCreate = () => {
        const newRanking = {
            rankingTitle: '',
            numerationType: 'decimal',
            books: []
        }
        setRankingToEdit(newRanking);
        setIsEditView(true);
    };

    const handleRankingEdit = (rankingData) => {
        setRankingToEdit(rankingData);
        setIsEditView(true);
    };

    const handleRankingSave = async () => {
        try {
            const response = await fetch("http://localhost:8080/rankings" + (rankingToEdit.id ? `/${rankingToEdit.id}` : ""), {
                method: rankingToEdit.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(rankingToEdit),
            });

            if (!response.ok) {
                const errorData = await response.json();
                //setError(errorData.message || "Wystąpił błąd");
                // todo: handle errors
                return;
            }

            toggleView();
            await revalidator.revalidate();
        } catch (err) {
            console.log(err);
        }
    }

    const handleRankingDelete = async (rankingData) => {
        try {
            const response = await fetch(`http://localhost:8080/rankings/${rankingData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                //setError(errorData.message || "Wystąpił błąd");
                // todo: handle errors
                return;
            }

            await revalidator.revalidate();
        } catch (err) {
            console.log(err);
        }
    };

    // if error message
    if (!isUserLoggedIn || typeof rankings.message !== 'undefined') {
        return (
            <h2>Nie jesteś zalogowany.</h2>
        );
    }

    if (!isEditView)
        return (
            <>
                <RankingsList rankings={rankings} onRankingEdit={handleRankingEdit}
                              onRankingDelete={handleRankingDelete}/>
                <button onClick={handleRankingCreate}>Nowy ranking</button>
            </>
        );
    else
        return (
            <RankingForm rankingData={rankingToEdit} setRankingData={setRankingToEdit} toggleEditView={toggleView}
                         handleRankingSave={handleRankingSave}/>
        )
};

export const rankingsLoader = async () => {
    return fetch('http://localhost:8080/rankings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(err => console.log(err));
}

export default RankingsLayout;