import { useEffect, useState, useRef } from 'react'
import MatchupCard from '../matchupCard/matchupCard.jsx'
import { Link, useParams } from 'react-router' // Import useNavigate for navigation
import { useSelector } from 'react-redux';
import { isSameDay, valueBetConditionCheck, calculateProfitFromUSOdds, allStatLabelsShort, getNumericStat, reverseComparisonStats } from '../../utils/constants.js'
import LeadingTeams from '../leadingTeams/leadingTeams.jsx';

const SingleSportDisplay = (props) => {
    const { league } = useParams(); // Get the matchup ID from the URL
    const { games, sports, pastGames, mlModelWeights } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams);
    const { sportsbook } = useSelector((state) => state.user);
    const [valueFilter, setValueFilter] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // State to hold the sorting preference
    const [sortAscending, setSortAscending] = useState('↑'); // State to hold the sorting order preference
    const [sportTeams, setSportTeams] = useState()
    const [sortedTeams, setSortedTeams] = useState()
    const [averageIndex, setAverageIndex] = useState()
    const [weightsRankedByImp, setWeightsRanked] = useState()
    const [open, setOpen] = useState(false);
    const [openSort, setOpenSort] = useState(false);
    const dropdownRef = useRef(null);
    // Initialize accumulator object
    const categorySums = {};
    const categoryCounts = {};

    // Compute averages
    const categoryAverages = {};
    Object.keys(categorySums).forEach(key => {
        categoryAverages[key] = categorySums[key] / categoryCounts[key]; // or use numTeams if all teams have the same keys
    });


    useEffect(() => {
        if (!league || !sports.length || !teams.length || !mlModelWeights.length) return;

        const sport = sports.find((sport) => sport.name === league);
        if (!sport) return; // optional: protect from bad league name
        setSportTeams(teams.filter((team) => team.league === league));
        const sportWeights = mlModelWeights.find((weight) => weight.sport === sport.id);
        if (!sportWeights) return;

        // ✅ Shallow copy featureImportanceScores before sorting
        const weightsRankedByImp = [...sportWeights.featureImportanceScores].sort(
            (scoreA, scoreB) => scoreB.importance - scoreA.importance
        );

        setWeightsRanked(weightsRankedByImp);

        const tempAverageIndex = teams.filter((team) => team.league === league).reduce((acc, team) => acc + team.statIndex, 0) / teams.filter((team) => team.league === league).length;
        setAverageIndex(tempAverageIndex);

        teams.filter((team) => team.league === league).forEach(team => {
            const statIndexes = team.statCategoryIndexes;
            Object.entries(statIndexes).forEach(([key, value]) => {
                if (!categorySums[key]) {
                    categorySums[key] = 0;
                    categoryCounts[key] = 0;
                }
                categorySums[key] += value;
                categoryCounts[key] += 1;
            });
        });

        const sortedTeams = [...teams].filter((team) => team.league === league).sort((teamA, teamB) => teamB.statIndex - teamA.statIndex);
        setSortedTeams(sortedTeams);

    }, [teams, sports, mlModelWeights, games]);


    // Function to navigate back to the landing page

    return (
        <div className='flex flex-row justify-between items-start gap-4' style={{ padding: '1rem', width: '99.1vw' }}>
            <div style={{ width: '17%' }}  >
                <div style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff', padding: 10, borderRadius: '.5rem' }}>
                    <div className="text-center">Better Bets Power Rankings</div>
                    <div>
                        {sportTeams && sortedTeams.map((team, idx) => {
                            const prevTeam = sortedTeams[idx - 1];
                            const isCrossingAverage =
                                idx > 0 &&
                                ((prevTeam.statIndex >= averageIndex && team.statIndex < averageIndex) ||
                                    (prevTeam.statIndex < averageIndex && team.statIndex >= averageIndex)); // Just in case
                            return (
                                <>
                                    {isCrossingAverage && (
                                        <div style={{ borderTop: '2px solid gray', margin: '8px 0' }}>
                                        </div>
                                    )}
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }} key={team.id}>
                                        <div style={{ width: '7%', textAlign: 'center' }}>{`${idx + 1}.`}</div>

                                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <img style={{ maxWidth: '1.3rem' }} src={team.lightLogo} />
                                            {`${team.espnLeague.includes('college') ? team.school : `${team.abbreviation} ${team.teamName}`} (${team.currentStats.seasonWinLoss}) `}
                                        </div>

                                        <div style={{ minWidth: '4rem', textAlign: 'right' }}>
                                            {`${(((team.statIndex - averageIndex) / averageIndex) * 100).toFixed(2)}%`}
                                        </div>

                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div style={{ width: '65%' }}>
                <div style={{ backgroundColor: '#2a2a2a', borderColor: '#575757', color: '#ffffff', borderRadius: '.5rem' }}>
                    <div>
                        <div style={{ textAlign: 'right' }}>

                            <div className="relative inline-block text-left mt-4 text-sm mx-4" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="bg-commonButton text-commonButtonText px-4 py-2 rounded shadow border border-commonButton"
                                >
                                    Filters
                                </button>

                                {open && (
                                    <div className="absolute z-10 mt-2 w-64 bg-secondary rounded shadow-lg border border-gray-200 p-4">
                                        <div className="mb-4">
                                            <label className="flex items-center space-x-2">
                                                <span>Show only Value Games</span>
                                                <input
                                                    type="checkbox"
                                                    checked={valueFilter}
                                                    onChange={() => setValueFilter(!valueFilter)}
                                                    className="accent-yellow-600"
                                                />
                                            </label>
                                        </div>

                                        <div className="mb-4">
                                            <span>Sort by:</span>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <div className="relative">
                                                    <button
                                                        className="bg-commonButton text-black px-2 py-1 rounded border border-commonButton"
                                                        onClick={() => setOpenSort(!openSort)}
                                                    >
                                                        {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                                                    </button>
                                                    {openSort && (
                                                        <div className="absolute z-20 mt-2 w-40 bg-zinc-900 rounded shadow-lg border border-gray-200 p-2">
                                                            <ul className="space-y-1">
                                                                <li>
                                                                    <button
                                                                        className="w-full text-left px-2 py-1 hover:bg-commonButton hover:text-black"
                                                                        onClick={() => {
                                                                            setSortBy('date');
                                                                            setOpenSort(false);
                                                                        }}
                                                                    >
                                                                        Date
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="w-full text-left px-2 py-1 hover:bg-commonButton hover:text-black"
                                                                        onClick={() => {
                                                                            setSortBy('index');
                                                                            setOpenSort(false);
                                                                        }}
                                                                    >
                                                                        Index
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="w-full text-left px-2 py-1 hover:bg-commonButton hover:text-black"
                                                                        onClick={() => {
                                                                            setSortBy('confidence');
                                                                            setOpenSort(false);
                                                                        }}
                                                                    >
                                                                        Confidence
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    className="text-sm px-2 py-1 border rounded"
                                                    onClick={() => setSortAscending(sortAscending === '↓' ? '↑' : '↓')}
                                                >
                                                    {sortAscending}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <span className="block mb-1 font-medium">Index difference range</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                className="w-full accent-yellow-600"
                                            // Add onChange here if needed
                                            />
                                        </div>

                                        <div>
                                            <span className="block mb-1 font-medium">Confidence</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                className="w-full accent-yellow-600"
                                            // Add onChange here if needed
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {
                            games && games.filter((game) => game.sport_key === league).length > 0 ? (
                                games.filter((game) => game.sport_key === league).filter((game) => {
                                    if (valueFilter) {
                                        return valueBetConditionCheck(sports, game, sportsbook, games);
                                    }
                                    return true;
                                }).sort((gameA, gameB) => {
                                    if (sortBy === 'date') {
                                        if (sortAscending === '↑') {
                                            return new Date(gameA.commence_time) - new Date(gameB.commence_time);
                                        } else if (sortAscending === '↓') {
                                            return new Date(gameB.commence_time) - new Date(gameA.commence_time);
                                        }
                                    } else if (sortBy === 'index') {
                                        if (sortAscending === '↑') {
                                            return Math.abs(gameA.predictedWinner === 'home' ? gameA.homeTeamScaledIndex - gameA.awayTeamScaledIndex : gameA.awayTeamScaledIndex - gameA.homeTeamScaledIndex) - Math.abs(gameB.predictedWinner === 'home' ? gameB.homeTeamScaledIndex - gameB.awayTeamScaledIndex : gameB.awayTeamScaledIndex - gameB.homeTeamScaledIndex);
                                        } else if (sortAscending === '↓') {
                                            return Math.abs(gameB.predictedWinner === 'home' ? gameB.homeTeamScaledIndex - gameB.awayTeamScaledIndex : gameB.awayTeamScaledIndex - gameB.homeTeamScaledIndex) - Math.abs(gameA.predictedWinner === 'home' ? gameA.homeTeamScaledIndex - gameA.awayTeamScaledIndex : gameA.awayTeamScaledIndex - gameA.homeTeamScaledIndex);
                                        }

                                    } else if (sortBy === 'confidence') {
                                        if (sortAscending === '↑') {
                                            return (gameA.predictionConfidence) - (gameB.predictionConfidence);
                                        } else if (sortAscending === '↓') {
                                            return (gameB.predictionConfidence) - (gameA.predictionConfidence);
                                        }

                                    }
                                }).map((game) => (
                                    <div key={game.id}>
                                        <MatchupCard todaysGames={games.filter((game) => isSameDay(game.commence_time, new Date()))} key={game.id} gameData={game} />
                                    </div>
                                ))
                            ) : (
                                <p>No upcoming games found.</p>
                            )
                        }
                    </div>

                </div>
            </div>
            <div style={{ width: '17%' }} >
                <div style={{ backgroundColor: '#2a2a2a', borderColor: '#575757', color: '#ffffff', borderRadius: '.5rem', padding: 10 }}>
                    <div>
                        {sportTeams &&
                            <div>
                                <div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div>
                                            TOP 10 STATS
                                        </div>
                                    </div>
                                    {weightsRankedByImp && weightsRankedByImp.map((weight, idx) => {
                                        if (idx < 10) {
                                            let sortedStatTeams = sportTeams.sort((teamA, teamB) => teamB.statIndex - teamA.statIndex).sort((teamA, teamB) => {
                                                let teamAStat = getNumericStat(teamA.currentStats, weight.feature)
                                                let teamBStat = getNumericStat(teamB.currentStats, weight.feature)
                                                if (teamAStat === teamBStat) {
                                                    return teamB.statIndex - teamA.statIndex
                                                }
                                                if (reverseComparisonStats.find((stat) => stat === weight.feature)) {
                                                    return teamAStat - teamBStat
                                                }
                                                return teamBStat - teamAStat
                                            })
                                            let statValue
                                            if (typeof sortedStatTeams[0].currentStats[weight.feature] === 'string') {
                                                statValue = sortedStatTeams[0].currentStats[weight.feature]
                                            } else if (weight.feature.includes('Percentage')) {
                                                statValue = `${(sortedStatTeams[0].currentStats[weight.feature] * 100).toFixed(1)}%`
                                            } else {
                                                if (sortedStatTeams[0].currentStats[weight.feature] > 1) {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(0)
                                                } else if (sortedStatTeams[0].currentStats[weight.feature] === 0) {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(0)
                                                } else {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(3)
                                                }

                                            }
                                            return (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', padding: '.25rem 0', borderBottom: '1px solid #575757' }} key={weight.feature}>
                                                    <div style={{ textAlign: 'left', width: '33%' }}>
                                                        {allStatLabelsShort[weight.feature] === 'Point Diff' && league === 'baseball_mlb' ? 'Run Diff' : allStatLabelsShort[weight.feature]}
                                                    </div>
                                                    <div style={{ textAlign: 'left', width: '33%' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                            <div style={{ paddingRight: 0 }}> <img src={sortedStatTeams[0].darkLogo} style={{ maxWidth: '1rem' }} /></div>
                                                            <div style={{ paddingLeft: 0 }}>
                                                                {`${sortedStatTeams[0].espnLeague.includes('college') ? sortedStatTeams[0].school : `${sortedStatTeams[0].teamName}`} `}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', width: '33%' }}>
                                                        {statValue}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>}
                        <div style={{ marginTop: '.5rem' }}>
                            {sportTeams && <LeadingTeams sortedTeams={sportTeams.sort((teamA, teamB) => teamB.statIndex - teamA.statIndex)} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleSportDisplay
