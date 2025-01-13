const LoginForm = () => {
    return (
        <section>
            <h2>Logowanie użytkownika</h2>
            <form id="new_account_form">
                <label htmlFor="input_username">Nazwa użytkownika</label>
                <input type="text" id="input_username" name="username"/>
                <label htmlFor="input_password">Utwórz nowe hasło:</label>
                <input type="password" id="input_password" name="password"/>
                <p id="error_summary"/>
                <input
                    type="submit"
                    id="btn_save"
                    name="submit"
                    className=""
                    defaultValue="Zaloguj się"
                />
            </form>
        </section>
    );
};

export default LoginForm;