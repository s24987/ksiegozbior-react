import './styles/App.css';

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import Home, {allBooksLoader} from "./components/Home";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import Library from "./components/Library";
import Statistics from "./components/Statistics";
import Rankings from "./components/Rankings";
import {useState} from "react";
import LoginLayout from "./components/LoginLayout";
import LoginForm from "./components/LoginForm";
import SignInForm from "./components/SignInForm";


function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const router = createBrowserRouter(
        createRoutesFromElements([
            <Route path="/" element={<Root/>}>
                <Route index element={<Home isUserLoggedIn={isUserLoggedIn} isUserAdmin={isUserAdmin}/>}
                       loader={allBooksLoader}/>
                <Route path={"profile"} element={<Profile/>}/>
                <Route path={"library"} element={<Library/>}/>
                <Route path={"statistics"} element={<Statistics/>}/>
                <Route path={"rankings"} element={<Rankings/>}/>
            </Route>,
            <Route path="/users" element={<LoginLayout/>}>
                <Route path={"log-in"} element={<LoginForm/>}/>
                <Route path={"sign-in"} element={<SignInForm/>}/>
            </Route>
        ])
    );

    return (
        <RouterProvider router={router}/>
    );
}

const Root = () => {
    return (
        <MainLayout/>
    )
}

export default App;