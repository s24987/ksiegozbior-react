import {useOutletContext} from "react-router-dom";

const Rankings = () => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Twoje rankingi");

    return(
        <h1>Rankingi</h1>
    );
};

export default Rankings;