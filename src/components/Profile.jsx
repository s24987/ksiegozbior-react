import React from "react";
import {useLoaderData, useOutletContext} from "react-router-dom";

const Profile = () => {
    const [setHeaderTitle] = useOutletContext();
    const userData = useLoaderData();
    setHeaderTitle("Profil użytkownika");

    // if no error message, display user data
    if (typeof userData.message === 'undefined')
        return (
            <>
                <h1>Witaj, {userData.username}!</h1>
                <section>
                    <b>Adres e-mail:</b> {userData.email}
                    <br/>
                    <b>Data urodzenia:</b> {new Date(userData.birthdate).toISOString().split('T')[0]}
                </section>
                <button>Edytuj profil</button>
                <button className="delete btn-next">Usuń profil</button>
            </>
        )
    else
        return (
            <h2>Nie jesteś zalogowany.</h2>
        )
};

export const profileLoader = async () => {
    return fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(response => {
            let res = response.json()
            console.log(res);
            return res;
        })
        .catch((error) => console.log(error));
};

export default Profile;