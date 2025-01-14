import Ranking from "./Ranking";

const RankingsList = ({rankings, onRankingEdit, onRankingDelete}) => {
    return (
        <>
            {rankings.map(ranking => (
                <>
                    <section className="middle-section ranking-box">
                        <Ranking rankingData={ranking}/>
                        <button onClick={() => {onRankingEdit(ranking)}}>Edytuj ranking</button>
                        <button className="delete btn-next" onClick={() => {onRankingDelete(ranking)}}>Usuń ranking</button>
                    </section>
                </>
            ))}

        </>
    );
};

export default RankingsList;