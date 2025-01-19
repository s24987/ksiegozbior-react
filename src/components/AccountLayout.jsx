import '../styles/AccountForm.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AccountLayout = ({closeModal, logIn}) => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => {
        setIsLoginView((prev) => !prev);
    };

    return (
        <div className="login-layout">
            {isLoginView ? (
                <LoginForm closeModal={closeModal} logIn={logIn}/>
            ) : (
                <SignUpForm closeModal={closeModal}/>
            )}
            <div className="toggle-view">
                {isLoginView ? (
                    <div>
                        <p>Nie masz konta?{" "}</p>
                        <button type="button" onClick={toggleView}>Zarejestruj się</button>
                    </div>
                ) : (
                    <div>
                        <p>Masz już konto?{" "}</p>
                        <button type="button" onClick={toggleView}>Zaloguj się</button>
                    </div>
                )}
            </div>
            <button type="button" className="delete" onClick={closeModal}>
                Zamknij
            </button>
        </div>
    );
};

export default AccountLayout;