const SignInForm = () => {
    return (
        <section>
            <h2>Nowy użytkownik</h2>
            <form id="new_account_form">
                <label htmlFor="input_username">Nazwa użytkownika</label>
                <input type="text" id="input_username" name="username"/>
                <label htmlFor="input_email">Adres e-mail:</label>
                <input type="email" id="input_email" name="email"/>
                <label htmlFor="input_birthday">Data urodzenia:</label>
                <input type="date" id="input_birthday" name="birthday"/>
                <label htmlFor="input_password">Utwórz nowe hasło:</label>
                <input type="password" id="input_password" name="password"/>
                <p id="error_summary"/>
                <input
                    type="submit"
                    id="btn_save"
                    name="submit"
                    className=""
                    defaultValue="Zapisz"
                />
            </form>
        </section>
    );
};

export default SignInForm;