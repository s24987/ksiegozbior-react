import ReactModal from 'react-modal';
import AccountLayout from "./AccountLayout";

const Header = ({title = "Księgozbiór", isAccountModalOpen, openAccountModal, closeAccountModal}) => {
    return (
        <header id="main_header">
            <h1>{title}</h1>
            <button onClick={openAccountModal}>Zaloguj się</button>
            <ReactModal isOpen={isAccountModalOpen}>
                <AccountLayout closeModal={closeAccountModal}/>
            </ReactModal>
        </header>
    );
};

export default Header;