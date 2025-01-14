import {useLoaderData, useOutletContext} from "react-router-dom";
import {useState} from "react";
import RankingForm from "./RankingForm";
import RankingsList from "./RankingsList";
import '../styles/Ranking.css';

const RankingsLayout = ({isUserLoggedIn}) => {
    const [setHeaderTitle] = useOutletContext();
    const rankings = useLoaderData();
    setHeaderTitle("Twoje rankingi");
    const [isEditView, setIsEditView] = useState(false);

    const toggleView = () => {
        setIsEditView((prev) => !prev);
    };

    // if error message
    if (!isUserLoggedIn || typeof rankings.message !== 'undefined') {
        return (
            <h2>Nie jesteś zalogowany.</h2>
        );
    }

    if (!isEditView)
    return(
        <>
            <RankingsList rankings={rankings}/>
            <button onClick={toggleView}>Nowy ranking</button>
        </>
    );
    else
        return(
            <RankingForm closeForm={toggleView}/>
        )
};

export const rankingsLoader = async () => {
    return  fetch('http://localhost:8080/rankings', {
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