import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import NumberLine from '../../dataVisComponents/numberLine/numberLine.jsx';
import WinrateVsProbabilityBar from '../../dataVisComponents/winrateVsProbabilityBar/winRateVsProbabilityBar.jsx';

const MatchupCardExtendBetting = ({ gameData }) => {
    const { sportsbook } = useSelector((state) => state.user);
    const [bestSportsbook, setBestSportsbook] = useState();
    const { sports } = useSelector((state) => state.games);
    const [sportSettings, setSportSettings] = useState();
    const indexDiff = gameData.predictedWinner === 'home' ? gameData.homeTeamScaledIndex - gameData.awayTeamScaledIndex : gameData.awayTeamScaledIndex - gameData.homeTeamScaledIndex

    function sortBookmakersByOutcomePrice(bookmakers, teamName) {
        return [...bookmakers].sort((a, b) => {
            const outcomeA = a.markets[0]?.outcomes.find(o => o.name === teamName);
            const outcomeB = b.markets[0]?.outcomes.find(o => o.name === teamName);

            if (outcomeA && outcomeB) {
                return outcomeB.price - outcomeA.price;
            }

            return outcomeA ? -1 : 1;
        });
    }



    useEffect(() => {
        let sport = sports.find(s => s.name === gameData.sport_key);
        if (sport) {
            setSportSettings(sport.valueBetSettings.find((setting) => setting.bookmaker === 'fanduel'));
        }
        const sortedBookmakers = sortBookmakersByOutcomePrice(gameData.bookmakers, gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName);
        if (sortedBookmakers.length > 0) {
            setBestSportsbook(sortedBookmakers[0].key);
        }



    }, [gameData, bestSportsbook, sports, sportsbook]);

    // const pModel = gameData.predictionConfidence;

    // const o = gameData?.bookmakers?.find(b => b.key === sportsbook)?.markets?.find(m => m.key === 'h2h').outcomes?.find(o => o.name === (gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName))
    // let EV
    // if (o) {
    //     // Convert American odds to decimal odds if needed
    //     let odds = o.price ?? o.odds;
    //     if (odds > 0 && odds < 1000 || odds < 0 && odds > -1000) {
    //         odds = odds > 0 ? 1 + odds / 100 : 1 - 100 / odds;
    //     }
    //     EV = (pModel * odds) - 1;
    // }



    return (
        <div style={{ width: '90%' }}>
            <div style={{ borderBottom: '2px solid white', padding: 5 }}>
                <div style={{ fontSize: '1rem', textAlign: 'center' }}>{`Pick: ${gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName}`}</div>
            </div>
            <div className='flex flex-col'>
                <div style={{ textAlign: 'center' }}>
                    Projected Scores
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row justify-evenly' style={{ width: '50%' }}>
                        <div>
                            {gameData.homeTeamDetails.abbreviation}
                        </div>
                        <div>
                            {gameData.predictedHomeScore}
                        </div>
                    </div>
                    <div className='flex flex-row justify-evenly' style={{ width: '50%' }}>
                        <div>
                            {gameData.awayTeamDetails.abbreviation}
                        </div>
                        <div>
                            {gameData.predictedAwayScore}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                Probability
                            </div>
                        </div>
                        {gameData?.bookmakers?.find(b => b.key === sportsbook)?.markets?.find(m => m.key === 'h2h') && <div>
                            <WinrateVsProbabilityBar
                                internalWinrate={gameData.predictionConfidence * 100}
                                impliedProbability={gameData?.bookmakers?.find(b => b.key === sportsbook)?.markets?.find(m => m.key === 'h2h').outcomes?.find(o => o.name === (gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName))?.impliedProbability * 100}
                            />
                        </div>}
                    </div>

                </div>
            </div>
            <div>
                <div>
                    <div>
                        {/* <div style={{ textAlign: 'center' }}>
                            <div>
                                Expected Value
                            </div>
                        </div>
                        <div>
                        {`EV: ${EV}`}
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MatchupCardExtendBetting;
