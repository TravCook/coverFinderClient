import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statConfigMap } from '../../utils/statMaps';
import useResizeObserver from '../../utils/hooks/useResizeObserver';
import StatBarChart from '../dataVisComponents/statBarChart/statBarChart';
import { areColorsTooSimilar } from '../../utils/constants';

const MatchupDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { sports, games, pastGames } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);
    const [barChartDimensions, setBarChartDimensions] = useState({ width: '100%', height: '100%' });
    const [gameData, setGameData] = useState();
    const [sortedTeams, setSortedTeams] = useState();
    const [sortedByCategory, setSortedByCategory] = useState();
    const [activeStatMap, setActiveStatMap] = useState();
    const [homeStats, setHomeStats] = useState();
    const [awayStats, setAwayStats] = useState();
    const [sport, setSport] = useState();

    useEffect(() => {
        let tempGameData = games.find((game) => game.id === parseInt(id));
        if (!tempGameData) tempGameData = pastGames.find((game) => game.id === parseInt(id));
        setGameData(tempGameData);

        let tempSortedTeams = [...teams].filter((team) => team.league === tempGameData.sport_key).sort((teamA, teamB) => teamB.statIndex - teamA.statIndex);
        setSortedTeams(tempSortedTeams);
        let sport = [...sports].find((sport) => sport.name === tempGameData.sport_key);
        if (sport) {
            let tempSortedByCategory = {};
            let sportCategories = Object.keys(statConfigMap[sport?.espnSport].categories);
            sportCategories.forEach((key) => {
                let categorySortedTeams = [...teams].filter((team) => team.league === tempGameData.sport_key).sort((teamA, teamB) => teamB.statCategoryIndexes[key] - teamA.statCategoryIndexes[key]);
                tempSortedByCategory[key] = categorySortedTeams;
            });
            setSortedByCategory(tempSortedByCategory);
        }
        const tempSport = [...sports].find((s) => s.name === tempGameData.sport_key);
        setSport(tempSport);
    }, [games, sports, teams, pastGames, id]);

    useEffect(() => {
        const config = statConfigMap[sport?.espnSport];
        if (config) {
            setActiveStatMap(config.default);
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
            setActiveStatMap(config.default);
            setHomeStats(gameData.homeTeamDetails.statCategoryIndexes);
            setAwayStats(gameData.awayTeamDetails.statCategoryIndexes);
        }
    };

    const chartContainerRef = useRef();
    const dimensions = useResizeObserver(chartContainerRef);

    return (
        <div className="flex flex-col m-2 md:m-4 bg-secondary text-text rounded shadow">
            <title>{`${gameData?.awayTeamDetails.abbreviation} @ ${gameData?.homeTeamDetails.abbreviation} ${new Date(gameData?.commence_time).toLocaleDateString()}`}</title>
            <div className="flex flex-col gap-4">
                {/* Teams Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 py-2">
                    {/* Away Team */}
                    <div className="flex flex-row flex-1 items-center justify-center gap-2 w-full md:w-[45%]">
                        <img className="w-16 md:w-20 max-w-xs" src={gameData?.awayTeamDetails.lightLogo} alt="Away Team" />
                        <div className="text-2xl md:text-4xl font-bold truncate">{gameData?.awayTeamDetails.espnDisplayName}</div>
                    </div>
                    {/* Score/Predicted */}
                    <div className="flex flex-col items-center justify-center w-full md:w-[10%] text-center gap-1">
                        <div className="text-xs md:text-base">{`${new Date(gameData?.commence_time).toLocaleDateString()} @ ${new Date(gameData?.commence_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</div>
                        <div className="text-sm">{gameData?.complete ? `Score` : `Predicted Score`}</div>
                        <div className="flex flex-row justify-around gap-2 w-full">
                            <div className={`${gameData?.complete ? 'border-solid' : 'border-dashed'} border rounded px-2 py-1 text-lg md:text-2xl w-1/2`}>{gameData?.predictedAwayScore}</div>
                            <div className={`${gameData?.complete ? 'border-solid' : 'border-dashed'} border rounded px-2 py-1 text-lg md:text-2xl w-1/2`}>{gameData?.predictedHomeScore}</div>
                        </div>
                    </div>
                    {/* Home Team */}
                    <div className="flex flex-row flex-1 items-center justify-center gap-2 w-full md:w-[45%]">
                        <img className="w-16 md:w-20 max-w-xs" src={gameData?.homeTeamDetails.lightLogo} alt="Home Team" />
                        <div className="text-2xl md:text-4xl font-bold truncate">{gameData?.homeTeamDetails.espnDisplayName}</div>
                    </div>
                </div>
                {/* Stats Section */}
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Away Team Stats */}
                    <div className="flex flex-col border-r border-gray-600 w-full md:w-1/2 px-2">
                        <div>
                            <div className="flex flex-row justify-evenly my-2 gap-2">
                                <div className="flex flex-row gap-1 justify-center border rounded px-2 py-1 w-1/2 md:w-1/4">
                                    <div>BB Score:</div>
                                    <div>{gameData?.awayTeamScaledIndex?.toFixed(1)}</div>
                                </div>
                                <div className="flex flex-row justify-center gap-2 border rounded px-2 py-1 w-1/2 md:w-1/4 text-center">
                                    <div>BB Rank:</div>
                                    <div>{sortedTeams?.findIndex((team) => gameData.awayTeamDetails.id === team.id) + 1}</div>
                                </div>
                            </div>
                            <div className="flex flex-row flex-wrap md:flex-nowrap justify-evenly gap-2 my-2 overflow-x-auto">
                                {sortedByCategory && Object.keys(sortedByCategory).map((category) => {
                                    let categoryIndex = (sortedByCategory[category].findIndex((team) => gameData.awayTeamDetails.id === team.id) + 1);
                                    return (
                                        <div
                                            key={category}
                                            className={`${categoryIndex < 6 ? 'bg-green-900' : categoryIndex > 25 ? 'bg-red-900' : 'bg-primary'} flex flex-col items-center rounded border px-2 py-1 min-w-[90px]`}
                                        >
                                            <div className="border-b w-full text-center text-xs md:text-sm">{category === 'general' ? 'WINS' : category.toUpperCase()}</div>
                                            <div className="flex flex-row justify-center gap-2 text-xs md:text-base">
                                                <div>Rank:</div>
                                                <div>{categoryIndex}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* Home Team Stats */}
                    <div className="flex flex-col border-l border-gray-600 w-full md:w-1/2 px-2">
                        <div>
                            <div className="flex flex-row justify-evenly my-2 gap-2">
                                <div className="flex flex-row gap-1 justify-center border rounded px-2 py-1 w-1/2 md:w-1/4">
                                    <div>BB Score:</div>
                                    <div>{gameData?.homeTeamScaledIndex?.toFixed(1)}</div>
                                </div>
                                <div className="flex flex-row justify-center gap-2 border rounded px-2 py-1 w-1/2 md:w-1/4 text-center">
                                    <div>BB Rank:</div>
                                    <div>{sortedTeams?.findIndex((team) => gameData.homeTeamDetails.id === team.id) + 1}</div>
                                </div>
                            </div>
                            <div className="flex flex-row flex-wrap md:flex-nowrap justify-evenly gap-2 my-2 overflow-x-auto">
                                {sortedByCategory && Object.keys(sortedByCategory).map((category) => {
                                    let categoryIndex = (sortedByCategory[category].findIndex((team) => gameData.homeTeamDetails.id === team.id) + 1);
                                    return (
                                        <div
                                            key={category}
                                            className={`${categoryIndex < 6 ? 'bg-green-900' : categoryIndex > 25 ? 'bg-red-900' : 'bg-primary'} flex flex-col items-center rounded border px-2 py-1 min-w-[90px]`}
                                        >
                                            <div className="border-b w-full text-center text-xs md:text-sm">{category === 'general' ? 'WINS' : category.toUpperCase()}</div>
                                            <div className="flex flex-row justify-center gap-2 text-xs md:text-base">
                                                <div>Rank:</div>
                                                <div>{categoryIndex}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="text-xs md:text-base mt-2">picks, dog, fav</div>
                    </div>
                </div>
            </div>
            {/* Betting breakdown and recent results */}
            <div className="flex flex-col md:flex-row gap-2 mt-4">
                <div className="flex-1 bg-primary rounded p-2 text-xs md:text-base">betting breakdown</div>
                <div className="flex-1 bg-primary rounded p-2 text-xs md:text-base">recent results</div>
            </div>
            {/* Stat Table and Chart */}
            <div className="flex flex-col mt-4">
                <div className="mb-2 text-xs md:text-base">stat table?</div>
                <div className="p-2 md:p-5">
                    <div className="bg-primary rounded w-full" style={{ height: '33vh' }} ref={chartContainerRef}>
                        {(dimensions && activeStatMap) && (
                            <StatBarChart
                                dimensions={dimensions}
                                sport={sport}
                                useIndividualYScales={activeStatMap !== statConfigMap[sport?.espnSport].categories.general}
                                handleStatSectionClick={handleStatSectionClick}
                                homeStats={homeStats}
                                awayStats={awayStats}
                                statMap={activeStatMap}
                                homeColor={gameData.homeTeamDetails.mainColor}
                                awayColor={areColorsTooSimilar(gameData.homeTeamDetails.mainColor, gameData.awayTeamDetails.mainColor) ? gameData.awayTeamDetails.secondaryColor : gameData.awayTeamDetails.mainColor}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchupDetails;
