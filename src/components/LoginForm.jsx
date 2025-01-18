import {useState} from "react";
import {parseErrors} from "../utils";

const LoginForm = ({closeModal, logIn}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || parseErrors(errorData.errors) || "Błąd logowania";
                await setError(errorMessage);
                return;
            }

            logIn();
            closeModal();
        } catch (err) {
            console.error("Błąd podczas logowania:", err);
            setError("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    return (
        <section>
            <h2>Logowanie użytkownika</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="input_username">Nazwa użytkownika</label>
                <input type="text" id="input_username" name="username" onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="input_password">Utwórz nowe hasło:</label>
                <input type="password" id="input_password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                {error !== '' &&
                    <p id="error_summary">{error}</p>
                }
                <input
                    type="submit"
                    name="submit"
                    defaultValue="Zaloguj się"
                    value="Zaloguj się"
                />
            </form>
        </section>
    );
};

export default LoginForm;