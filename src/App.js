import './styles/App.css';

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import Home from "./Home";
import Profile from "./Profile";
import MainLayout from "./MainLayout";


function App() {
    const router = createBrowserRouter(
        createRoutesFromElements([
                <Route path="/" element={<Root/>}>
                    <Route index element={<Home/>}/>
                    <Route path={"profile"} element={<Profile/>}/>
                </Route>,
            ]
        )
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