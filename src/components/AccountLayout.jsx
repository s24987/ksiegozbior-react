import '../styles/AccountForm.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import SignInForm from "./SignInForm";

const AccountLayout = ({closeModal}) => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => {
        setIsLoginView((prev) => !prev);
    };

    return (
        <div className="login-layout">
            {isLoginView ? (
                <LoginForm/>
            ) : (
                <SignInForm/>
            )}
            <div className="toggle-view">
                {isLoginView ? (
                    <div>
                        <p>Nie masz konta?{" "}</p>
                        <button onClick={toggleView}>Zarejestruj się</button>
                    </div>
                ) : (
                    <div>
                        <p>Masz już konto?{" "}</p>
                        <button onClick={toggleView}>Zaloguj się</button>
                    </div>
                )}
            </div>
            <button className="delete" onClick={closeModal}>
                Zamknij
            </button>
        </div>
    );
};

export default AccountLayout;