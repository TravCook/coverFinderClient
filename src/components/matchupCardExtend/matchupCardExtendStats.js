import { useState, useRef, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { normalizeStat, generalStats, offenseStats, defenseStats, passingStats, rushingStats, receivingStats, kickingStats, returningStats, battingStats, pitchingStats, fieldingStats, penaltyStats, baseballStatMap, basketballStatMap, hockeyStatMap, footballStatMap, sigmoidNormalize, reverseComparisonStats, getColorForIndex } from '../../utils/constants';
import SpiderChart from '../spiderChart/spiderChart';
import useResizeObserver from '../../utils/hooks/useResizeObserver';
import { useSelector } from 'react-redux';
import WaterfallChart from '../waterfallChart/waterfallChart';

const MatchupCardExtendStats = ({ gameData }) => {
    const [statHeaderSport, setStatSport] = useState(['General', 'Offense', 'Defense'])
    const [datasets, setDatasets] = useState([])
    const { mlModelWeights, sports } = useSelector((state) => state.games)
    const sport = sports.find((sport) => sport.name === gameData.sport_key)

    useEffect(() => {
        if (gameData.sport === 'basketball') {
            setStatSport(['General', 'Offense', 'Defense'])
        } else if (gameData.sport === 'football') {
            setStatSport(['General', 'Passing', 'Rushing', 'Receiving', 'Defense', 'Kicking', 'Returning'])
        }
        else if (gameData.sport === 'baseball') {
            setStatSport(['General', 'Batting', 'Pitching', 'Fielding'])
        }
        else if (gameData.sport === 'hockey') {
            setStatSport(['General', 'Offense', 'Defense', 'Penalty'])
        }
    }, [gameData]);
    useEffect(() => {
        let statMap

        switch (gameData.sport) {
            case 'basketball':
                statMap = basketballStatMap
                break;
            case 'football':
                statMap = footballStatMap
                break;
            case 'baseball':
                statMap = baseballStatMap
                break;
            case 'hockey':
                statMap = hockeyStatMap
                break;
            default:
                statMap = []
                break;
        }
        const datasetA = [];
        const datasetB = [];
        statHeaderSport.forEach((statGroup) => {
            let homeDiff = 0
            let awayDiff = 0
            let statIndex
            switch (statGroup) {
                case 'General':
                    statIndex = 0
                    Object.keys(generalStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {


                            if (generalStat === 'seasonWinLoss' || generalStat === 'homeWinLoss') {
                                if (generalStat === 'homeWinLoss') {
                                    let homeWinsSplit = gameData.homeTeamStats[generalStat].split('-')
                                    let awayWinsSplit = gameData.awayTeamStats['awayWinLoss'].split('-')
                                    let homeWins = parseInt(homeWinsSplit[0])
                                    let awayWins = parseInt(awayWinsSplit[0])
                                    if (homeWins >= awayWins) {
                                        homeDiff++
                                    } else {
                                        awayDiff++
                                    }

                                }
                                else {
                                    let homeWinsSplit = gameData.homeTeamStats[generalStat].split('-')
                                    let awayWinsSplit = gameData.awayTeamStats[generalStat].split('-')
                                    let homeWins = parseInt(homeWinsSplit[0])
                                    let awayWins = parseInt(awayWinsSplit[0])
                                    if (homeWins >= awayWins) {
                                        homeDiff++
                                    } else {
                                        awayDiff++
                                    }

                                }


                            } else if (generalStat !== 'awayWinLoss') {
                                if (reverseComparisonStats.includes(generalStat)) {
                                    if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                        homeDiff++
                                    }
                                    else {
                                        awayDiff++
                                    }
                                } else {
                                    if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                        homeDiff++
                                    }
                                    else {
                                        awayDiff++
                                    }
                                }

                            }

                            statIndex++
                        }
                        
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Offense':
                    statIndex = 0
                    Object.keys(offenseStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        } else {
                            console.log(generalStat)
                        }
                        

                    })

                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Defense':
                    statIndex = 0
                    Object.keys(defenseStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })

                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Passing':
                    statIndex = 0
                    Object.keys(passingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Rushing':
                    statIndex = 0
                    Object.keys(rushingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Receiving':
                    statIndex = 0
                    Object.keys(receivingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Kicking':
                    statIndex = 0
                    Object.keys(kickingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Returning':
                    statIndex = 0
                    Object.keys(returningStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Batting':
                    statIndex = 0
                    Object.keys(battingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })

                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Pitching':
                    statIndex = 0
                    Object.keys(pitchingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })

                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Fielding':
                    statIndex = 0
                    Object.keys(fieldingStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                    })

                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                case 'Penalty':
                    statIndex = 0
                    Object.keys(penaltyStats).forEach((generalStat) => {
                        if (gameData.homeTeamStats.hasOwnProperty(generalStat) && gameData.awayTeamStats.hasOwnProperty(generalStat) && statMap.includes(generalStat)) {
                            if (reverseComparisonStats.includes(generalStat)) {
                                if (gameData.homeTeamStats[generalStat] < gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            } else {
                                if (gameData.homeTeamStats[generalStat] > gameData.awayTeamStats[generalStat]) {
                                    homeDiff++
                                }
                                else {
                                    awayDiff++
                                }
                            }
                            statIndex++
                        }
                        console.log(statIndex)
                    })
                    datasetA.push({ axis: statGroup, value: (homeDiff / statIndex) * 100 });
                    datasetB.push({ axis: statGroup, value: (awayDiff / statIndex) * 100 });
                    break;
                default:
                    break;
            }
        })

        setDatasets([datasetA, datasetB]);
    }, [statHeaderSport]);

    const chartContainerRef = useRef();
    const dimensions = useResizeObserver(chartContainerRef);
    return (
        <div>
            <div style={{ width: '100%', height: '20vh' }} ref={chartContainerRef}>
                {dimensions && datasets && <SpiderChart datasets={datasets} dimensions={dimensions} colors={[getColorForIndex(gameData.homeTeamScaledIndex), getColorForIndex(gameData.awayTeamScaledIndex)]} />}
            </div>

        </div>
    );
}

export default MatchupCardExtendStats;