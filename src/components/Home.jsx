import {useLoaderData, useOutletContext} from "react-router-dom";
import LibraryBook from "./LibraryBook";
import {useState} from "react";
import '../styles/Library.css';

const Home = ({isUserLoggedIn, isUserAdmin}) => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Księgozbiór");
    const loadedBooks = useLoaderData();
    const [books, setBooks] = useState(loadedBooks);

    return (
        <>
            <div id="search_box">
                <input type="search" id="input_search" placeholder="Search"/>
                <button type="submit" id="btn_search">
                    <svg
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
                </button>
            </div>
            <div id="search_results">
                {books.map(book => (
                    <LibraryBook isUserLoggedIn={isUserLoggedIn} isUserAdmin={isUserAdmin} book={book}/>
                ))}
            </div>
        </>
    )
};

export const allBooksLoader = async () => {
    return fetch('http://localhost:8080/books')
        .then(response => {
            const res =response.json();
            console.log(res);
            return res;
        })
        .catch((error) => console.log(error));
};

export default Home;