import {NavLink, Outlet} from "react-router-dom";
import {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
    let [headerTitle, setHeaderTitle] = useState("Księgozbiór");

    return (
        <>
            <Header title={headerTitle}/>
            <nav id="nav_bar">
                <NavLink to="/">Home</NavLink>&nbsp;
                <NavLink to="/profile">Profil</NavLink>
            </nav>
            <section id="page_body">
                <Outlet context={[setHeaderTitle]}/>
            </section>
            <Footer/>
        </>
    );
}

export default MainLayout;