import {useLoaderData, useOutletContext, useRevalidator} from "react-router-dom";
import {useState} from "react";
import RankingForm from "./RankingForm";
import RankingsList from "./RankingsList";
import '../styles/Ranking.css';
import {parseErrors} from "../utils";

const RankingsLayout = ({isUserLoggedIn}) => {
    const revalidator = useRevalidator();
    const [setHeaderTitle] = useOutletContext();
    let rankings = useLoaderData();
    setHeaderTitle("Twoje rankingi");
    const [isEditView, setIsEditView] = useState(false);
    const [rankingToEdit, setRankingToEdit] = useState(null);
    const [addedRankingRecords, setAddedRankingRecords] = useState([]);
    const [deletedRankingRecords, setDeletedRankingRecords] = useState([]);

    const toggleView = () => {
        setIsEditView((prev) => !prev);
        if (!isEditView) {
            setRankingToEdit(null);
            setAddedRankingRecords([]);
            setDeletedRankingRecords([]);
            revalidator.revalidate();
        }
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
        setRankingToEdit(structuredClone(rankingData));
        setIsEditView(true);
    };

    const handleRankingSave = async () => {
        try {
            const rankingResponse = await fetch("http://localhost:8080/rankings" + (rankingToEdit.id ? `/${rankingToEdit.id}` : ""), {
                method: rankingToEdit.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(rankingToEdit),
            });


            if (!rankingResponse.ok) {
                const errorData = await rankingResponse.json();
                //setError(errorData.message || "Wystąpił błąd");
                // todo: handle errors
                return;
            }

            let rankingId = rankingToEdit.id;
            if (!rankingToEdit.id) {
                const newRankingId = await rankingResponse.json().then(json => json.id);
                rankingId = newRankingId;
                setRankingToEdit(prev => ({
                    ...prev,
                    id: newRankingId
                }));
            }

            // save ranking records
            await saveRankingRecords(rankingId);

            toggleView();
            await revalidator.revalidate();
        } catch (err) {
            console.log(err);
        }
    }

    const saveRankingRecords = async (rankingId) => {
        // save new records
        try {
            const results = await Promise.all(
                addedRankingRecords.map(r => saveNewRankingRecord(rankingId, r))
            );
            console.log('Błędy podczas zapisywania:', results);
        } catch (error) {
            console.error('Błąd podczas zapisywania:', error);
        }

        // delete records
        try {
            const results = await Promise.all(
                deletedRankingRecords.map(r => deleteRankingRecord(rankingId, r))
            );
            console.log('Błędy podczas usuwania:', results);
        } catch (error) {
            console.error('Błąd podczas usuwania:', error);
        }
    }

    const saveNewRankingRecord = async (rankingId, recordToSave) => {
        try {
            const response = await fetch(`http://localhost:8080/rankings/records/${rankingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(recordToSave),
            });

            if (!response.ok) {
                const errorMessage = await response.json().then(json => (json.message || (parseErrors(json.errors))));
                return errorMessage;
            }
            return null;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRankingRecord = async (rankingId, recordToDelete) => {
        try {
            const response = await fetch(`http://localhost:8080/rankings/records/${rankingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(recordToDelete),
            });

            if (!response.ok) {
                const errorMessage = await response.json().then(json => (json.message || (parseErrors(json.errors))));
                return errorMessage;
            }
            return null;
        } catch (error) {
            console.log(error);
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
            <RankingForm rankingData={rankingToEdit} setRankingData={setRankingToEdit}
                         addedRankingRecords={addedRankingRecords} setAddedRankingRecords={setAddedRankingRecords}
                         deletedRankingRecords={deletedRankingRecords}
                         setDeletedRankingRecords={setDeletedRankingRecords}
                         toggleEditView={toggleView} handleRankingSave={handleRankingSave}/>
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