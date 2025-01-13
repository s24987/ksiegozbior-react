import React from "react";
import {useOutletContext} from "react-router-dom";

const Home = () => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Profil użytkownika");

    return (
        <>
            <h1>Witaj na profilu!</h1>
        </>
    )
};

export default Home;