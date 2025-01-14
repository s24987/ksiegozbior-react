import Ranking from "./Ranking";

const RankingsList = ({rankings}) => {
    return (
        <>
            {rankings.map(ranking => (
                <>
                    <section className="middle-section ranking-box">
                        <Ranking rankingData={ranking}/>
                        <button>Edytuj ranking</button>
                        <button className="delete btn-next">Usuń ranking</button>
                    </section>
                </>
            ))}

        </>
    );
};

export default RankingsList;