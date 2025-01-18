import {useLoaderData, useOutletContext, useRevalidator} from "react-router-dom";
import {useState} from "react";
import RankingForm from "./RankingForm";
import RankingsList from "./RankingsList";
import '../styles/Ranking.css';
import {combineMessages, parseErrors} from "../utils";

const RankingsLayout = ({isUserLoggedIn}) => {
    const revalidator = useRevalidator();
    const [setHeaderTitle] = useOutletContext();
    let rankings = useLoaderData();
    setHeaderTitle("Twoje rankingi");
    const [isEditView, setIsEditView] = useState(false);
    const [rankingToEdit, setRankingToEdit] = useState(null);
    const [addedRankingRecords, setAddedRankingRecords] = useState([]);
    const [deletedRankingRecords, setDeletedRankingRecords] = useState([]);
    const [updatedRankingRecords, setUpdatedRankingRecords] = useState([]);
    const [error, setError] = useState(null);

    const toggleView = () => {
        setIsEditView((prev) => !prev);
        if (!isEditView) {
            setRankingToEdit(null);
            setAddedRankingRecords([]);
            setDeletedRankingRecords([]);
            setUpdatedRankingRecords([]);
            revalidator.revalidate();
        }
        setError(null);
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
                setError(errorData.message || parseErrors(errorData.errors) || 'Wystąpił błąd podczas zapisywania');
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
            const combinedErrorMessage = combineMessages(results);
            if (combinedErrorMessage) {
                setError(combinedErrorMessage);
                console.log('Błędy podczas zapisywania: ', results);
            }
        } catch (error) {
            setError('Wystąpił błąd podczas dodawania rekordu');
            console.error('Błąd podczas zapisywania:', error);
        }

        // delete records
        try {
            const results = await Promise.all(
                deletedRankingRecords.map(r => deleteRankingRecord(rankingId, r))
            );
            const combinedErrorMessage = combineMessages(results);
            if (combinedErrorMessage) {
                setError(combinedErrorMessage);
                console.log('Błędy podczas usuwania: ', results);
            }
        } catch (error) {
            setError('Wystąpił błąd podczas usuwania rekordu');
            console.error('Błąd podczas usuwania: ', error);
        }

        // update records
        try {
            const results = await Promise.all(
                updatedRankingRecords.map(r => updateRankingRecord(rankingId, r))
            );
            const combinedErrorMessage = combineMessages(results);
            if (combinedErrorMessage) {
                setError(combinedErrorMessage);
                console.log('Błędy podczas zapisywania: ', results);
            }
        } catch (error) {
            setError('Wystąpił błąd podczas aktualizacji rekordu');
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

    const updateRankingRecord = async (rankingId, recordUpdate) => {
        try {
            const response = await fetch(`http://localhost:8080/rankings/records/${rankingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(recordUpdate),
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
                setError(errorData.message || parseErrors(errorData.errors) || 'Wystąpił błąd podczas usuwania rankingu');
                return;
            }

            await revalidator.revalidate();
        } catch (err) {
            console.log(err);
        }
    };

    // if error message
    if (!isUserLoggedIn || (rankings.message)) {
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
                <p id="error_summary">{error}</p>
            </>
        );
    else
        return (
            <>
                <RankingForm rankingData={rankingToEdit} setRankingData={setRankingToEdit}
                             addedRankingRecords={addedRankingRecords} setAddedRankingRecords={setAddedRankingRecords}
                             deletedRankingRecords={deletedRankingRecords}
                             setDeletedRankingRecords={setDeletedRankingRecords}
                             updatedRankingRecords={updatedRankingRecords}
                             setUpdatedRankingRecords={setUpdatedRankingRecords}
                             toggleEditView={toggleView} handleRankingSave={handleRankingSave}/>
                <p id="error_summary">{error}</p>
            </>

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