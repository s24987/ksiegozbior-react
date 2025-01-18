import {useState} from "react";
import {parseErrors} from "../utils";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const LoginForm = ({closeModal, logIn}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validationSchema = yup.object().shape({
        username: yup.string().min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki").required("Nazwa użytkownika jest wymagana"),
        password: yup.string().min(6, "Hasło musi mieć co najmniej 6 znaków").required("Hasło jest wymagane"),
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });


    const onSubmit = async (e) => {
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="input_username">Nazwa użytkownika</label>
                <input type="text" id="input_username" name="username" {...register("username")}
                       onChange={(e) => setUsername(e.target.value)}/>
                {errors.username && <p className="error-message">{errors.username.message}</p>}

                <label htmlFor="input_password">Utwórz nowe hasło:</label>
                <input type="password" id="input_password" name="password"  {...register("password")}
                       onChange={(e) => setPassword(e.target.value)}/>
                {errors.password && <p className="error-message">{errors.password.message}</p>}

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