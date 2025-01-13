import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import '../styles/AccountForm.css';

const LoginLayout = () => {

    return (
        <>
            <Header/>
            <section id="page_body">
                <Outlet/>
            </section>
            <Footer/>
        </>
    );
}

export default LoginLayout;