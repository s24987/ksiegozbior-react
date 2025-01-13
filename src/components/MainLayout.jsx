import {NavLink, Outlet} from "react-router-dom";
import {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
    let [headerTitle, setHeaderTitle] = useState("Księgozbiór");
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    const openAccountModal = () => {
        setIsAccountModalOpen(true);
    }

    const closeAccountModal = () => {
        setIsAccountModalOpen(false);
    }

    return (
        <>
            <Header title={headerTitle} isAccountModalOpen={isAccountModalOpen} openAccountModal={openAccountModal}
                    closeAccountModal={closeAccountModal}/>
            <nav id="nav_bar">
                <h3>Menu</h3>
                <NavLink to="/">Strona główna</NavLink>
                <NavLink to="/profile">Profil</NavLink>
                <NavLink to="/library">Biblioteka</NavLink>
                <NavLink to="/rankings">Rankingi</NavLink>
                <NavLink to="/statistics">Statystyki</NavLink>
            </nav>
            <section id="page_body">
                <Outlet context={[setHeaderTitle]}/>
            </section>
            <Footer/>
        </>
    );
}

export default MainLayout;