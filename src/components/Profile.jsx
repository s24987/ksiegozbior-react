import React, {useState} from "react";
import {useLoaderData, useOutletContext, useRevalidator} from "react-router-dom";
import {parseErrors} from "../utils";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const Profile = ({isUserLoggedIn, logOut}) => {
    const [setHeaderTitle] = useOutletContext();
    const userData = useLoaderData();
    const revalidator = useRevalidator();

    const [email, setEmail] = useState(userData.email);
    const [birthdate, setBirthdate] = useState(userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : null);
    const [fullName, setFullName] = useState(userData.fullName);
    const [isEditView, setIsEditView] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    setHeaderTitle("Profil użytkownika");

    const validationSchema = yup.object().shape({
        fullName: yup.string()
            .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki")
            .max(255, "Imię i nazwisko nie może mieć więcej niż 255 znaków")
            .required("To pole jest wymagane"),
        email: yup.string()
            .email("Niepoprawny adres e-mail")
            .max(255, "Adres e-mail nie może mieć więcej niż 255 znaków")
            .required("Adres e-mail jest wymagany"),
        password: yup.string()
            .min(6, "Hasło musi mieć co najmniej 6 znaków")
            .max(255, "Hasło nie może mieć więcej niż 255 znaków")
            .required("Hasło jest wymagane"),
        birthdate: yup.date()
            .typeError("Data urodzenia musi być poprawną datą")
            .required("Data urodzenia jest wymagana")
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const toggleEditView = () => {
        setIsEditView((prevState) => !prevState);
        setError(null);
    }

    const handleUserUpdate = async () => {
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

            await toggleEditView();
            await revalidator.revalidate();
        } catch (err) {
            console.error("Błąd podczas aktualizacji użytkownika: ", err);
            setError("Wystąpił błąd. Spróbuj ponownie później.");
        }
    }

    const onSubmit = async (e) => {
        await handleUserUpdate();
    }

    const handleUserDelete = async () => {
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <section>
                        <b>Imię i nazwisko:</b> {userData.fullName}
                        <br/>
                        {isEditView && (
                            <>
                                <input type="text" id="input_full_name" name="full_name" className="dynamic-edit-input"
                                       value={fullName} {...register("fullName")}
                                       onChange={(e) => {
                                           setFullName(e.target.value)
                                       }}/>
                                <br/>
                                {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
                            </>
                        )}

                        <b>Adres e-mail:</b> {userData.email}
                        <br/>
                        {isEditView && (
                            <>
                                <input type="email" id="input_email" name="email" className="dynamic-edit-input"
                                       value={email} {...register("email")} onChange={(e) => {
                                    setEmail(e.target.value)
                                }}/>
                                <br/>
                                {errors.email && <p className="error-message">{errors.email.message}</p>}
                            </>
                        )}

                        <b>Data urodzenia:</b> {new Date(userData.birthdate).toISOString().split('T')[0]}
                        <br/>
                        {isEditView && (
                            <>
                                <input type="date" id="input_birthday" name="birthday" className="dynamic-edit-input"
                                       value={birthdate} {...register("birthdate")} onChange={(e) => {
                                    setBirthdate(e.target.value)
                                }}/>
                                <br/>
                                {errors.birthdate && <p className="error-message">{errors.birthdate.message}</p>}
                            </>
                        )}

                        {isEditView && (
                            <>
                                <label htmlFor="input_password">Nowe hasło:</label>
                                <input type="password" id="input_password" name="password" {...register("password")}
                                       onChange={(e) => setPassword(e.target.value)}/>
                                {errors.password && <p className="error-message">{errors.password.message}</p>}
                            </>
                        )}

                        {isEditView && error && (
                            <p id="error_summary">{error}</p>
                        )}
                    </section>

                    <button type="button" onClick={toggleEditView}>
                        {isEditView ? "Anuluj" : "Edytuj profil"}
                    </button>
                    {isEditView && (
                        <button type="submit" className="btn-next">Zapisz</button>
                    )}
                    {!isEditView && (
                        <button type="button" className="delete btn-next" onClick={handleUserDelete}>Usuń
                            profil</button>
                    )}
                </form>
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