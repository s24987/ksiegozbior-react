import {useOutletContext} from "react-router-dom";

const Library = () => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Twoja biblioteka");

    return(
        <h1>Biblioteka</h1>
    );
};

export default Library;