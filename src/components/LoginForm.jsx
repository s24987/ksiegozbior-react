import {useState} from "react";

const LoginForm = ({closeModal, logIn}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Błąd logowania");
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
                <p id="error_summary" defaultValue={error}/>
                <input
                    type="submit"
                    name="submit"
                    defaultValue="Zaloguj się"
                />
            </form>
        </section>
    );
};

export default LoginForm;