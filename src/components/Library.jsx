import {useLoaderData, useOutletContext} from "react-router-dom";
import '../styles/Library.css'
import LibraryBook from "./LibraryBook";
import {useState} from "react";

const Library = ({isUserLoggedIn}) => {
    const [setHeaderTitle] = useOutletContext();
    const books = useLoaderData();
    setHeaderTitle("Twoja biblioteka");

    // if no error message
    if (typeof books.message !== 'undefined') {
        return (
            <h2>Nie jesteś zalogowany.</h2>
        );
    }

    return (
        <>
            <div id="search_results">
                {books.map(book => (
                    <LibraryBook isUserLoggedIn={isUserLoggedIn} isUserAdmin={true} book={book}/>
                ))}
            </div>
            <button>Dodaj do biblioteki</button>
        </>
    );
};

export const libraryLoader = async () => {
    return  fetch('http://localhost:8080/libraries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export default Library;