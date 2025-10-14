import { useParams, Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statConfigMap } from '../../utils/statMaps';
import useResizeObserver from '../../utils/hooks/useResizeObserver';
import StatBarChart from '../dataVisComponents/statBarChart/statBarChart';
import { areColorsTooSimilar } from '../../utils/constants';
import LeadingTeamsCard from '../leadingTeams/leadingTeamsCard'



const MatchupDetails = () => {

    const dispatch = useDispatch()
    const barChartContainerRef = useRef()
    const { id } = useParams(); // Get the matchup ID from the URL
    const { sports, games, pastGames, mlModelWeights } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    const [barChartDimensions, setBarChartDimensions] = useState({ width: '100%', height: '100%' });
    const [gameData, setGameData] = useState()
    const [sortedTeams, setSortedTeams] = useState()
    const [sortedByCategory, setSortedByCategory] = useState()
    const [activeStatMap, setActiveStatMap] = useState()
    const [homeStats, setHomeStats] = useState()
    const [awayStats, setAwayStats] = useState()
    const [sport, setSport] = useState()
    useEffect(() => {
        let tempGameData = games.find((game) => game.id === parseInt(id))
        if (!tempGameData) tempGameData = pastGames.find((game) => game.id === parseInt(id))
        console.log(tempGameData)
        setGameData(tempGameData)

        let tempSortedTeams = [...teams].filter((team) => team.league === tempGameData.sport_key).sort((teamA, teamB) => teamB.statIndex - teamA.statIndex)
        setSortedTeams(tempSortedTeams)
        let sport = [...sports].find((sport) => sport.name === tempGameData.sport_key)
        if (sport) {
            let tempSortedByCategory = {}
            let sportCategories = Object.keys(statConfigMap[sport?.espnSport].categories)
            sportCategories.map((key) => {
                let categorySortedTeams = [...teams].filter((team) => team.league === tempGameData.sport_key).sort((teamA, teamB) => teamB.statCategoryIndexes[key] - teamA.statCategoryIndexes[key])
                tempSortedByCategory[key] = categorySortedTeams
            })
            setSortedByCategory(tempSortedByCategory)
        }

        const tempSport = [...sports].find((s) => s.name === tempGameData.sport_key)
        setSport(tempSport)

    }, [games, sports])

    useEffect(() => {
        const config = statConfigMap[sport?.espnSport];
        if (config) {
            setActiveStatMap(config.default);
            console.log('stat map set')
        }
        setHomeStats(gameData?.homeTeamDetails.statCategoryIndexes);
        setAwayStats(gameData?.awayTeamDetails.statCategoryIndexes);
    }, [gameData, sport]);
    const handleStatSectionClick = (e) => {
        setHomeStats(gameData.homeStats.data);
        setAwayStats(gameData.awayStats.data);

        const config = statConfigMap[sport?.espnSport];

        if (!config) return;

        const selectedStat = config.categories[e.target.id];
        if (selectedStat) {
            setActiveStatMap(selectedStat);
        } else {
            // Default case
            setActiveStatMap(config.default);
            setHomeStats(gameData.homeTeamDetails.statCategoryIndexes);
            setAwayStats(gameData.awayTeamDetails.statCategoryIndexes);
        }
    };

    console.log(statConfigMap[sport?.espnSport])
    const chartContainerRef = useRef();
    const dimensions = useResizeObserver(chartContainerRef);
    return (

        <div className='flex flex-col m-4 bg-secondary text-text rounded'>
            <title>{`${gameData?.awayTeamDetails.abbreviation} @ ${gameData?.homeTeamDetails.abbreviation} ${new Date(gameData?.commence_time).toLocaleDateString()}`}</title>
            <div className='flex flex-col'>
                <div className='flex flex-row'>
                    <div className='flex flex-row flex-grow justify-center gap-1 items-center w-[45%]' >
                        <div>
                            <img style={{ maxWidth: '5rem' }} src={gameData?.awayTeamDetails.lightLogo} />
                        </div>
                        <div style={{ fontSize: '4rem' }}>
                            {gameData?.awayTeamDetails.espnDisplayName}
                        </div>
                    </div>
                    <div className='flex flex-col' style={{ width: '10%', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem' }}>{`${new Date(gameData?.commence_time).toLocaleDateString()} @ ${new Date(gameData?.commence_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</div>
                        <div>{gameData?.complete ? `Score` : `Predicted Score`}</div>
                        <div className='flex flex-row flex-grow justify-around'>
                            <div className={gameData?.complete ? `border border-solid` : `border border-dashed`} style={{ width: '35%', alignContent: 'center', fontSize: '1.9rem' }}>{gameData?.predictedAwayScore}</div>
                            <div className={gameData?.complete ? `border border-solid` : `border border-dashed`} style={{ width: '35%', alignContent: 'center', fontSize: '1.9rem' }}>{gameData?.predictedHomeScore}</div>
                        </div>
                    </div>
                    <div className='flex flex-row flex-grow justify-center gap-1 items-center  w-[45%]'  >
                        <div>
                            <img style={{ maxWidth: '5rem' }} src={gameData?.homeTeamDetails.lightLogo} />
                        </div>
                        <div style={{ fontSize: '4rem' }}>
                            {gameData?.homeTeamDetails.espnDisplayName}
                        </div>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-col border-r' style={{ width: '50%' }}>
                        <div>
                            <div className='flex flex-row justify-evenly my-2'>
                                <div className='flex flex-row gap-1 justify-center border' style={{ width: '25%' }}>
                                    <div>BB Score: </div>
                                    <div>{gameData?.awayTeamScaledIndex.toFixed(1)}</div>
                                </div>
                                <div className='flex flex-row justify-center gap-2 border' style={{ width: '25%', textAlign: 'center' }}>
                                    <div>BB Rank: </div>
                                    <div>{sortedTeams?.findIndex((team) => gameData.awayTeamDetails.id === team.id) + 1}</div>
                                </div>
                            </div>
                            <div className='flex flex-row flex-wrap justify-evenly gap-2 my-2'>
                                {sortedByCategory && Object.keys(sortedByCategory).map((category) => {
                                    let categoryIndex = (sortedByCategory[category].findIndex((team) => gameData.awayTeamDetails.id === team.id) + 1)
                                    return (
                                        <div className={`${categoryIndex < 6 ? 'bg-green-900' : categoryIndex > 25 ? 'bg-red-900' : 'bg-primary'} flex flex-col items-center rounded border`} style={{ width: '20%' }}>
                                            <div className='border-b' style={{ width: '100%', textAlign: 'center' }}>{category === 'general' ? 'WINS' : category.toUpperCase()}</div>
                                            <div className='flex flex-rank justify-center gap-2'>
                                                <div>Rank: </div>
                                                <div>{sortedByCategory[category].findIndex((team) => gameData.awayTeamDetails.id === team.id) + 1}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                    <div className='flex flex-col border-l' style={{ width: '50%' }}>

                        <div>
                            <div className='flex flex-row justify-evenly my-2'>
                                <div className='flex flex-row gap-1 justify-center border' style={{ width: '25%' }}>
                                    <div>BB Score: </div>
                                    <div>{gameData?.homeTeamScaledIndex.toFixed(1)}</div>
                                </div>
                                <div className='flex flex-row justify-center gap-2 border' style={{ width: '25%', textAlign: 'center' }}>
                                    <div>BB Rank: </div>
                                    <div>{sortedTeams?.findIndex((team) => gameData.homeTeamDetails.id === team.id) + 1}</div>
                                </div>
                            </div>
                            <div className='flex flex-row flex-wrap justify-evenly gap-2 my-2'>
                                {sortedByCategory && Object.keys(sortedByCategory).map((category) => {
                                    let categoryIndex = (sortedByCategory[category].findIndex((team) => gameData.homeTeamDetails.id === team.id) + 1)
                                    return (
                                        <div className={`${categoryIndex < 6 ? 'bg-green-900' : categoryIndex > 25 ? 'bg-red-900' : 'bg-primary'} flex flex-col items-center rounded border`} style={{ width: '20%' }}>
                                            <div className='border-b' style={{ width: '100%', textAlign: 'center' }}>{category === 'general' ? 'WINS' : category.toUpperCase()}</div>
                                            <div className='flex flex-rank justify-center gap-2'>
                                                <div>Rank: </div>
                                                <div>{categoryIndex}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>picks, dog, fav</div>
                    </div>
                </div>
            </div>

            <div>betting breakdown</div>
            <div>recent results</div>
            <div className='flex flex-col'>
                <div>
                    stat table?
                </div>
                <div className='p-5'>
                    <div className='bg-primary rounded' style={{ width: '100%', height: '33vh' }} ref={chartContainerRef}>
                        {(dimensions && activeStatMap) && <StatBarChart dimensions={dimensions} sport={sport} useIndividualYScales={(activeStatMap !== statConfigMap[sport?.espnSport].categories.general) ? true : false} handleStatSectionClick={handleStatSectionClick} homeStats={homeStats} awayStats={awayStats} statMap={activeStatMap} homeColor={gameData.homeTeamDetails.mainColor} awayColor={areColorsTooSimilar(gameData.homeTeamDetails.mainColor, gameData.awayTeamDetails.mainColor) ? gameData.awayTeamDetails.secondaryColor : gameData.awayTeamDetails.mainColor} />}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MatchupDetails;
