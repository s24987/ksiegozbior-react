import './styles/App.css';

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import Home, {allBooksLoader} from "./components/Home";
import Profile, {profileLoader} from "./components/Profile";
import MainLayout from "./components/MainLayout";
import Library, {libraryLoader} from "./components/Library";
import Statistics from "./components/Statistics";
import RankingsLayout, {rankingsLoader} from "./components/RankingsLayout";
import {useState} from "react";


function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const logIn = () => {
        setIsUserLoggedIn(true);
    }

    const logOut = () => {
        setIsUserLoggedIn(false);
    }

    const router = createBrowserRouter(
        createRoutesFromElements([
            <Route path="/" element={<MainLayout isUserLoggedIn={isUserLoggedIn} logIn={logIn} logOut={logOut}/>}>
                <Route index element={<Home isUserLoggedIn={isUserLoggedIn} isUserAdmin={isUserAdmin}/>}
                       loader={allBooksLoader}/>
                <Route path={"profile"} element={<Profile/>} loader={profileLoader}/>
                <Route path={"library"} element={<Library isUserLoggedIn={isUserLoggedIn}/>} loader={libraryLoader}/>
                <Route path={"statistics"} element={<Statistics/>}/>
                <Route path={"rankings"} element={<RankingsLayout isUserLoggedIn={isUserLoggedIn}/>} loader={rankingsLoader}/>
            </Route>,
        ])
    );

    checkIfUserLoggedIn(logIn);

    return (
        <RouterProvider router={router}/>
    );
}

async function checkIfUserLoggedIn(logIn) {
    const res = await fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (res.ok) {
        logIn();
    }
    else console.log(res);
}

export default App;