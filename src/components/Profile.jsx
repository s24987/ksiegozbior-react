import React, {useState} from "react";
import {useLoaderData, useOutletContext} from "react-router-dom";

const Profile = () => {
    const [setHeaderTitle] = useOutletContext();
    const userData = useLoaderData();
    setHeaderTitle("Profil użytkownika");

    const [email, setEmail] = useState(userData.email);
    const [birthdate, setBirthdate] = useState(new Date(userData.birthdate).toISOString().split('T')[0]);
    const [isEditView, setIsEditView] = useState(false);

    const toggleEditView = () => {
        setIsEditView(prevState => !prevState);
    }

    // if no error message, display user data
    if (typeof userData.message === 'undefined') {
        return (
            <>
                <h1>Witaj, {userData.username}!</h1>
                <section>
                    <b>Adres e-mail:</b> {userData.email}
                    <br/>
                    {isEditView && (
                        <>
                            <input type="email" id="input_email" name="email" className="dynamic-edit-input"
                                   value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }}/>
                            <br/>
                        </>
                    )}

                    <b>Data urodzenia:</b> {new Date(userData.birthdate).toISOString().split('T')[0]}
                    <br/>
                    {isEditView && (
                        <>
                            <input type="date" id="input_birthday" name="birthday" className="dynamic-edit-input"
                                   value={birthdate} onChange={(e) => {
                                setBirthdate(e.target.value)
                            }}/>
                            <br/>
                        </>
                    )}

                </section>
                <button onClick={toggleEditView}>
                    {isEditView? "Anuluj" : "Edytuj profil"}
                </button>
                {isEditView && (
                    <button className="btn-next">Zapisz</button>
                )}
                {!isEditView && (
                    <button className="delete btn-next">Usuń profil</button>
                )}
            </>
        )
    } else
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