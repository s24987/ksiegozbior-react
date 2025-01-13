import {useOutletContext} from "react-router-dom";

const Statistics = () => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Twoje statystyki");

    return(
        <h1>Statystyki</h1>
    );
};

export default Statistics;