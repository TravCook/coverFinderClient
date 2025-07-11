import { useState, useRef, useEffect } from 'react';
import { normalizeStat, offenseStats, defenseStats, passingStats, rushingStats, receivingStats, kickingStats, penaltyStats, basketballStatMap, returningStats, hockeyStatMap, footballStatMap, sigmoidNormalize, reverseComparisonStats, getColorForIndex } from '../../../utils/constants';
import useResizeObserver from '../../../utils/hooks/useResizeObserver';
import StatBarChart from '../../dataVisComponents/statBarChart/statBarChart.jsx';
import { useSelector } from 'react-redux';
import { areColorsTooSimilar } from '../../../utils/constants';
import { baseballStatMap, baseballStatCategoryMap, battingStats, pitchingStats, fieldingStats, generalStats } from '../../../utils/statMaps';

const MatchupCardExtendStats = ({ gameData }) => {
    const [statHeaderSport, setStatSport] = useState(['General', 'Offense', 'Defense'])
    const [datasets, setDatasets] = useState([])
    const { mlModelWeights, sports } = useSelector((state) => state.games)
    const [activeStatMap, setActiveStatMap] = useState()
    const [homeStats, setHomeStats] = useState()
    const [awayStats, setAwayStats] = useState()
    const sport = sports.find((sport) => sport.name === gameData.sport_key)
    useEffect(() => {
        if (sport.espnSport === 'basketball') {
            setStatSport(['General', 'Offense', 'Defense'])
        } else if (sport.espnSport === 'football') {
            setStatSport(['General', 'Passing', 'Rushing', 'Receiving', 'Defense', 'Kicking', 'Returning'])
        }
        else if (sport.espnSport === 'baseball') {
            setActiveStatMap(baseballStatCategoryMap)
            setHomeStats(gameData.homeTeamDetails.statCategoryIndexes)
            setAwayStats(gameData.awayTeamDetails.statCategoryIndexes)
        }
        else if (sport.espnSport === 'hockey') {
            setStatSport(['General', 'Offense', 'Defense', 'Penalty'])
        }
    }, [gameData]);

    const handleStatSectionClick = (e) => {
        switch (sport.espnSport) {
            case 'baseball':
                switch (e.target.id) {
                    case 'general':
                        setActiveStatMap(generalStats)
                        setHomeStats(gameData.homeStats.data)
                        setAwayStats(gameData.awayStats.data)
                        break;
                    case 'batting':
                        setActiveStatMap(battingStats)
                        setHomeStats(gameData.homeStats.data)
                        setAwayStats(gameData.awayStats.data)
                        break;
                    case 'pitching':
                        setActiveStatMap(pitchingStats)
                        setHomeStats(gameData.homeStats.data)
                        setAwayStats(gameData.awayStats.data)
                        break;
                    case 'fielding':
                        setActiveStatMap(fieldingStats)
                        setHomeStats(gameData.homeStats.data)
                        setAwayStats(gameData.awayStats.data)
                        break;
                    default:
                        setActiveStatMap(baseballStatCategoryMap)
                        setHomeStats(gameData.homeTeamDetails.statCategoryIndexes)
                        setAwayStats(gameData.awayTeamDetails.statCategoryIndexes)
                        break;
                }
        }
    }

    const chartContainerRef = useRef();
    const dimensions = useResizeObserver(chartContainerRef);
    return (
        <div style={{ width: '100%', height: '15vh', margin: '1rem 0' }} ref={chartContainerRef}>
            {dimensions && <StatBarChart dimensions={dimensions} handleStatSectionClick={handleStatSectionClick} homeStats={homeStats} awayStats={awayStats} statMap={activeStatMap} homeColor={gameData.homeTeamDetails.mainColor} awayColor={areColorsTooSimilar(gameData.homeTeamDetails.mainColor, gameData.awayTeamDetails.mainColor) ? gameData.awayTeamDetails.secondaryColor : gameData.awayTeamDetails.mainColor} />}
        </div>
    );
}

export default MatchupCardExtendStats;