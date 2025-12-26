import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hexToRgb, getLuminance } from '../../utils/constants';

const TeamRankings = ({ sport, pwrRankSort, categoryAverages, sortedTeams }) => {
    const { sports } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);
    const [sportTeams, setSportTeams] = useState([]);
    // const [sortedTeams, setSortedTeams] = useState([]);
    const [averageIndex, setAverageIndex] = useState(0);
    useEffect(() => {
        if (sortedTeams && sport) {
            const filteredTeams = sortedTeams.filter(team => team.league === sport);
            setSportTeams(filteredTeams);
            const totalIndex = filteredTeams.reduce((acc, team) => acc + team.scaledStatIndex, 0);
            const avgIndex = totalIndex / filteredTeams.length;
            setAverageIndex(avgIndex);

        }
    }, [sortedTeams, pwrRankSort])

    console.log(sportTeams)

    return (
        <div  >
            <div style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff', padding: 10, borderRadius: '.5rem' }}>
                <div className='flex flex-col'>
                    {sortedTeams && sortedTeams.map((team, idx) => {
                        const prevTeam = sortedTeams[idx - 1];
                        let isCrossingAverage
                        if (!pwrRankSort) {
                            isCrossingAverage =
                                idx > 0 &&
                                ((prevTeam.scaledStatIndex >= averageIndex && team.scaledStatIndex < averageIndex) ||
                                    (prevTeam.scaledStatIndex < averageIndex && team.scaledStatIndex >= averageIndex)); // Just in case
                        } else {

                            isCrossingAverage =
                                idx > 0 &&
                                ((prevTeam.statCategoryIndexes[pwrRankSort] >= categoryAverages[pwrRankSort] && team.statCategoryIndexes[pwrRankSort] < categoryAverages[pwrRankSort]) ||
                                    (prevTeam.statCategoryIndexes[pwrRankSort] < categoryAverages[pwrRankSort] && team.statCategoryIndexes[pwrRankSort] >= categoryAverages[pwrRankSort])); // Just in case
                        }
                        return (
                            <>
                                {isCrossingAverage && (
                                    <div style={{ borderTop: '2px solid gray', margin: '8px 0' }}>
                                    </div>
                                )}
                                <div style={{ width: '100%' }} className='flex flex-row items-center' key={team.id}>
                                    <div style={{ width: '10%' }}>{`${idx + 1}.`}</div>

                                    <div className='flex flex-row flex-grow'>
                                        <div style={{width: '10%'}}>
                                            <img style={{ maxWidth: '1.3rem' }} src={team.lightLogo} />
                                        </div>
                                        <div className='flex flex-grow' >
                                            {`${team.abbreviation} ${team.teamName}`}
                                        </div>
                                        {/* <div style={{width: '27%', textAlign: 'right'}}>
                                            {`(${team.currentStats.seasonWinLoss ? team.currentStats.seasonWinLoss : 'N/A'}) `}
                                        </div> */}
                                    </div>

                                    <div style={{ textAlign: 'right', width: '16%' }}>
                                        {pwrRankSort ? `${(((team.statCategoryIndexes[pwrRankSort] - categoryAverages[pwrRankSort]) / categoryAverages[pwrRankSort]) * 100).toFixed(2)}%` : `${(((team.scaledStatIndex - averageIndex) / averageIndex) * 100).toFixed(2)}%`}
                                    </div>

                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TeamRankings;
