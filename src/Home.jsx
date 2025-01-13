import {useOutletContext} from "react-router-dom";

const Home = () => {
    const [setHeaderTitle] = useOutletContext();
    setHeaderTitle("Księgozbiór");

    return (
        <>
            <section id="page_body"></section>
        </>
    )
};

export default Home;