import React, {useState} from "react";
import {useLoaderData, useOutletContext} from "react-router-dom";
import {parseErrors} from "../utils";

const Profile = ({isUserLoggedIn, logOut}) => {
    const [setHeaderTitle] = useOutletContext();
    const userData = useLoaderData();
    setHeaderTitle("Profil użytkownika");

    const [email, setEmail] = useState(userData.email);
    const [birthdate, setBirthdate] = useState(userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : null);
    const [fullName, setFullName] = useState(userData.fullName);
    const [isEditView, setIsEditView] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const toggleEditView = () => {
        setIsEditView(prevState => !prevState);
        if (!isEditView) {
            setError(null);
        }
    }

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        const userUpdateData = {
            username: userData.username,
            fullName: fullName,
            email: email,
            birthdate: birthdate,
            password: password
        }

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userUpdateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || parseErrors(errorData.errors) || 'Wystąpił błąd podczas aktualizacji');
                return;
            }

            toggleEditView();
        } catch (err) {
            console.error("Błąd podczas aktualizacji użytkownika: ", err);
            setError("Wystąpił błąd. Spróbuj ponownie później.");
        }
    }

    const hadleUserDelete = async () => {
        try {
            const response = await fetch("http://localhost:8080/users", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || parseErrors(errorData.errors) || 'Wystąpił błąd. Spróbuj ponownie później.');
            }

            logOut();
        } catch (err) {
            console.error("Błąd podczas usuwania użytkownika:", err);
            setError("Wystąpił błąd. Spróbuj ponownie później.");
        }
    }

    // if no error message, display user data
    if (isUserLoggedIn && !userData.message) {
        return (
            <>
                <h1>Witaj, {userData.username}!</h1>
                <section>
                    <b>Imię i nazwisko:</b> {userData.fullName}
                    <br/>
                    {isEditView && (
                        <>
                            <input type="text" id="input_full_name" name="full_name" className="dynamic-edit-input"
                                   value={fullName} onChange={(e) => {
                                setFullName(e.target.value)
                            }}/>
                            <br/>
                        </>
                    )}

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

                    {isEditView && (
                        <>
                            <label htmlFor="input_password">Nowe hasło:</label>
                            <input type="password" id="input_password" name="password"
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </>
                    )}

                    {isEditView && error(
                        <p id="error_summary">{error}</p>
                    )}
                </section>
                <button onClick={toggleEditView}>
                    {isEditView ? "Anuluj" : "Edytuj profil"}
                </button>
                {isEditView && (
                    <button className="btn-next" onClick={handleUserUpdate}>Zapisz</button>
                )}
                {!isEditView && (
                    <button className="delete btn-next" onClick={hadleUserDelete}>Usuń profil</button>
                )}
            </>
        )
    } else
        return (
            <>
                {error && (
                    <p id="error_summary">{error}</p>
                )}
                {!error && (
                    <h2>Nie jesteś zalogowany.</h2>
                )}
            </>

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