import { useState, useRef, useEffect } from 'react';
import useResizeObserver from '../../../utils/hooks/useResizeObserver';
import StatBarChart from '../../dataVisComponents/statBarChart/statBarChart.jsx';
import { useSelector } from 'react-redux';
import { areColorsTooSimilar } from '../../../utils/constants';
import { statConfigMap } from '../../../utils/statMaps';

const MatchupCardExtendStats = ({ gameData }) => {
    const { sports } = useSelector((state) => state.games)
    const [activeStatMap, setActiveStatMap] = useState()
    const [homeStats, setHomeStats] = useState()
    const [awayStats, setAwayStats] = useState()
    const sport = sports.find((sport) => sport.name === gameData.sport_key)


useEffect(() => {
    const config = statConfigMap[sport.espnSport];
    if (config) {
        setActiveStatMap(config.default);
    }
    setHomeStats(gameData.homeTeamDetails.statCategoryIndexes);
    setAwayStats(gameData.awayTeamDetails.statCategoryIndexes);
}, []);


const handleStatSectionClick = (e) => {
    console.log(gameData)
    setHomeStats(gameData.homeTeamDetails.currentStats);
    setAwayStats(gameData.awayTeamDetails.currentStats);

    const config = statConfigMap[sport.espnSport];

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


    const chartContainerRef = useRef();
    const dimensions = useResizeObserver(chartContainerRef);
    return (
        <div style={{ width: '100%', height: '15vh', margin: '1rem 0' }} ref={chartContainerRef}>
            {dimensions && <StatBarChart dimensions={dimensions} sport={sport} useIndividualYScales={( activeStatMap !== statConfigMap[sport.name].default && activeStatMap !== statConfigMap[sport.name].categories.general) ? true :false} handleStatSectionClick={handleStatSectionClick} homeStats={homeStats} awayStats={awayStats} statMap={activeStatMap} homeColor={gameData.homeTeamDetails.mainColor} awayColor={areColorsTooSimilar(gameData.homeTeamDetails.mainColor, gameData.awayTeamDetails.mainColor) ? gameData.awayTeamDetails.secondaryColor : gameData.awayTeamDetails.mainColor} />}
        </div>
    );
}

export default MatchupCardExtendStats;