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
    const handleLogout = async (e) => {
        try {
            const response = await fetch("http://localhost:8080/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                return;
            }

            logOut();
        } catch (err) {
            console.error("Błąd podczas wylogowywania:", err);
        }
    }

    return (
        <header id="main_header">
            <h1>{title}</h1>
            {isUserLoggedIn ? (
                <button onClick={handleLogout}>Wyloguj się</button>
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