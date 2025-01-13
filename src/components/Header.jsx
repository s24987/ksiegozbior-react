import ReactModal from 'react-modal';
import AccountLayout from "./AccountLayout";

const Header = ({
                    title = "Księgozbiór",
                    isAccountModalOpen,
                    openAccountModal,
                    closeAccountModal,
                    isUserLoggedIn,
                    logIn,
                    logOut
                }) => {
    return (
        <header id="main_header">
            <h1>{title}</h1>
            {isUserLoggedIn ? (
                <button onClick={logOut}>Wyloguj się</button>
            ): (
                <button onClick={openAccountModal}>Zaloguj się</button>
            )}

            <ReactModal isOpen={isAccountModalOpen}>
                <AccountLayout closeModal={closeAccountModal} logIn={logIn}/>
            </ReactModal>
        </header>
    );
};

export default Header;