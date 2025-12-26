import { useMemo, useState, useRef } from 'react';
import MatchupCard from '../matchupCard/matchupCard.jsx';
import { Link, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { 
    isSameDay, 
    valueBetConditionCheck, 
    calculateProfitFromUSOdds, 
    getNumericStat, 
    reverseComparisonStats 
} from '../../utils/constants.js';
import { allStatLabels, allStatNamesShort } from '../../utils/statMaps.js';
import LeadingTeams from '../leadingTeams/leadingTeams.jsx';
import TeamRankings from '../rankings/teamRanking.jsx';
import DogRankings from '../rankings/bettingRankings/dogRankings.jsx';
import FavRankings from '../rankings/bettingRankings/favRankings.jsx';

const SingleSportDisplay = (props) => {
    const { league } = useParams();
    const { games, sports, pastGames, mlModelWeights } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);
    const { sportsbook } = useSelector((state) => state.user);

    const [valueFilter, setValueFilter] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortAscending, setSortAscending] = useState('↑');
    const [open, setOpen] = useState(false);
    const [pwrRankSort, setPwrRankSort] = useState();
    const [openRankSort, setOpenRankSort] = useState(false);
    const [openSort, setOpenSort] = useState(false);
    const [teamFilter, setTeamFilter] = useState();
    const [teamFilterOpen, setTeamFilterOpen] = useState();
    const [currentSport, setCurrentSport] = useState();
    const dropdownRef = useRef(null);

    // -------------------------------
    // ✅ Memoized derived values
    // -------------------------------
    const memoizedSportData = useMemo(() => {
        if (!league || !sports.length || !teams.length || !mlModelWeights.length) return {};

        const sport = sports.find((s) => s.name === league);
        if (!sport) return {};

        document.title = sport.name;

        // Filter teams for this league
        const sportTeams = teams.filter((team) => team.league === league);

        // Get weights ranked by importance
        const sportWeights = mlModelWeights.find((weight) => weight.sport === sport.id);
        const weightsRankedByImp = sportWeights
            ? [...sportWeights.featureImportanceScoresTeam].sort((a, b) => b.importance - a.importance)
            : [];

        // Calculate average index
        const tempAverageIndex =
            sportTeams.reduce((acc, team) => acc + team.statIndex, 0) / (sportTeams.length || 1);

        // Sort teams by statIndex and calculate total games
        const sortedTeams = [...sportTeams]
            .map((team) => {
                const [wins = 0, losses = 0] = team.currentStats.seasonWinLoss?.split('-').map(Number) || [0, 0];
                return { ...team, totalGames: wins + losses };
            })
            .sort((a, b) => b.statIndex - a.statIndex);

        // Compute stat categories & averages
        const statCategories = sortedTeams[0] ? Object.keys(sortedTeams[0].statCategoryIndexes) : [];
        const categoryAverages = {};
        statCategories.forEach((category) => {
            categoryAverages[category] =
                sortedTeams.reduce((acc, team) => acc + team.statCategoryIndexes[category], 0) /
                (sortedTeams.length || 1);
        });

        return {
            sportTeams,
            weightsRankedByImp,
            averageIndex: tempAverageIndex,
            sortedTeams,
            statCategories,
            categoryAverages,
        };
    }, [teams, sports, mlModelWeights, league]); // dependencies

    // Destructure memoized values
    const {
        sportTeams,
        weightsRankedByImp,
        averageIndex,
        sortedTeams,
        statCategories,
        categoryAverages,
    } = memoizedSportData;

    // Function to navigate back to the landing page

    return (
        <div className='flex flex-row justify-between items-start gap-1' style={{ padding: '1rem' }}>
            <div className='bg-secondary rounded p-2' style={{ width: '19%' }}>
                <div>
                    <div className="text-center">Better Bets Power Rankings</div>
                    <div>
                        <div className="relative mb-4">
                            <button
                                className="w-full bg-zinc-700 text-white px-3 py-2 rounded flex justify-between items-center"
                                onClick={() => setOpenRankSort(!openRankSort)}
                                type="button"
                            >
                                {pwrRankSort ? pwrRankSort.charAt(0).toUpperCase() + pwrRankSort.slice(1) : 'Sort by'}
                                <span className="ml-2">{openRankSort ? '▲' : '▼'}</span>
                            </button>
                            {openRankSort && (
                                <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-600 rounded shadow-lg">
                                    <ul>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-zinc-700"
                                                onClick={() => {
                                                    setSortedTeams((sortedTeams) => [...sortedTeams].sort((teamA, teamB) => teamB.statIndex - teamA.statIndex));
                                                    setPwrRankSort(null);
                                                    setOpenRankSort(false);

                                                }}
                                            >
                                                Reset Sort
                                            </button>
                                        </li>
                                        {statCategories.map((category) => (
                                            <li key={category}>
                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-zinc-700"
                                                    onClick={() => {
                                                        setSortedTeams((sortedTeams) => [...sortedTeams].sort((teamA, teamB) => {
                                                            return teamB.statCategoryIndexes[category] - teamA.statCategoryIndexes[category];
                                                        }))
                                                        setPwrRankSort(category);
                                                        setOpenRankSort(false);

                                                    }}
                                                >
                                                    {category === 'general' ? 'Wins' : allStatLabels[category] || category}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                {sortedTeams && <TeamRankings sport={league} pwrRankSort={pwrRankSort} categoryAverages={categoryAverages} sortedTeams={sortedTeams.slice(0, 50)} />}
                {/* {league && <div className='flex flex-row' style={{ marginTop: '.5rem' }}>
                    <div className='flex flex-col border-r' style={{ width: '50%' }}>
                        <div className='border-b' style={{ textAlign: 'center' }}>
                            TOP DOGS
                        </div>
                        <DogRankings sport={league} />
                    </div>
                    <div className='flex flex-col border-l' style={{ width: '50%' }}>
                        <div className='border-b' style={{ textAlign: 'center' }}>
                            TOP FAVORITES
                        </div>
                        <FavRankings sport={league} />
                    </div>
                </div>} */}
            </div>
            <div style={{ width: '80%' }}>
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
                                        <div>
                                            <button
                                                className="bg-commonButton text-black px-2 py-1 rounded border border-commonButton"
                                                onClick={() => setTeamFilterOpen(!teamFilterOpen)}
                                            >
                                                Filter For Team
                                            </button>
                                            {teamFilterOpen && (
                                                <div className="absolute z-20 mt-2 bg-zinc-900 rounded shadow-lg border border-gray-200 p-2" style={{ width: '130%' }}>
                                                    <ul className="space-y-1 flex flex-row flex-wrap">
                                                        <li style={{ width: '100%' }}>
                                                            <button
                                                                className="w-full text-left px-2 py-1 hover:bg-commonButton hover:text-black"
                                                                onClick={() => {
                                                                    setTeamFilter(null);
                                                                    setOpenTeamFilter(false);
                                                                }}
                                                            >
                                                                Reset
                                                            </button>
                                                        </li>
                                                        {sportTeams?.sort((teamA, teamB) => {
                                                            if (teamA.espnDisplayName < teamB.espnDisplayName) return -1;
                                                            if (teamA.espnDisplayName > teamB.espnDisplayName) return 1;
                                                            return 0;
                                                        }).map((team) => {
                                                            return (
                                                                <li style={{ width: '50%' }}>
                                                                    <button
                                                                        className="w-full text-left px-2 py-1 hover:bg-commonButton hover:text-black"
                                                                        onClick={() => {
                                                                            setTeamFilter(team.espnDisplayName);
                                                                            setOpenTeamFilter(false);
                                                                        }}
                                                                    >
                                                                        {team.abbreviation} {team.teamName}
                                                                    </button>
                                                                </li>
                                                            )

                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        {
                            games && games.filter((game) => game.sport_key === league).length > 0 ? (
                                games.filter((game) => game.sport_key === league).filter((game) => {
                                    if (valueFilter) {
                                        return valueBetConditionCheck(sports, game, sportsbook, 'h2h');
                                    }
                                    if (teamFilter) {
                                        return game.homeTeamDetails.espnDisplayName === teamFilter || game.awayTeamDetails.espnDisplayName === teamFilter
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
            <div style={{ width: '19%' }} >
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
                                            } else if (weight.feature.includes('Percentage') || weight.feature.includes('Pct')) {
                                                statValue = `${(sortedStatTeams[0].currentStats[weight.feature]).toFixed(1)}%`
                                            } else {

                                                if (sortedStatTeams[0].currentStats[weight.feature] > 1) {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(0)
                                                } else if (sortedStatTeams[0].currentStats[weight.feature] === 0) {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(0)
                                                } else if (sortedStatTeams[0].currentStats[weight.feature]) {
                                                    statValue = (sortedStatTeams[0].currentStats[weight.feature]).toFixed(3)
                                                }

                                            }
                                            return (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', padding: '.25rem 0', borderBottom: '1px solid #575757' }} key={weight.feature}>
                                                    <div style={{ textAlign: 'left', width: '40%' }}>
                                                        {allStatNamesShort[weight.feature] === 'Point Diff' && league === 'baseball_mlb' ? 'Run Diff' : allStatNamesShort[weight.feature]}
                                                    </div>
                                                    <div style={{ textAlign: 'left', width: '45%' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                            <div style={{ paddingRight: 0 }}> <img src={sortedStatTeams[0].darkLogo} style={{ maxWidth: '1rem' }} /></div>
                                                            <div style={{ paddingLeft: 0 }}>
                                                                {`${sortedStatTeams[0].espnLeague.includes('college') ? sortedStatTeams[0].school : `${sortedStatTeams[0].teamName}`} `}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', width: '15%' }}>
                                                        {statValue}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>}
                    </div>
                </div>
                {sortedTeams && <LeadingTeams sortedTeams={sortedTeams} />}
            </div>
        </div>
    )
}

export default SingleSportDisplay
