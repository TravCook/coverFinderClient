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
            const outcomeA = a.markets[0].outcomes.find(o => o.name === teamName);
            const outcomeB = b.markets[0].outcomes.find(o => o.name === teamName);

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
                        { gameData?.bookmakers?.find(b => b.key === sportsbook)?.markets.find(m => m.key === 'h2h') && <div>
                            <WinrateVsProbabilityBar
                                internalWinrate={gameData.winPercent}
                                impliedProbability={gameData?.bookmakers?.find(b => b.key === sportsbook)?.markets?.find(m => m.key === 'h2h').outcomes?.find(o => o.name === (gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName))?.impliedProbability * 100}
                            />
                        </div>}
                    </div>
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                Index Delta
                            </div>
                        </div>
                        <div >
                            <NumberLine min={-50} max={50} rangeStart={sportSettings?.indexDiffSmall} rangeEnd={sportSettings?.indexDiffSmall + sportSettings?.indexDiffRange} point={indexDiff} pointLabel={indexDiff.toFixed(2)} />
                        </div>
                    </div>
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                Confidence
                            </div>
                        </div>
                        <div >
                            <NumberLine min={50} max={100} rangeStart={sportSettings?.confidenceSmall * 100} rangeEnd={(sportSettings?.confidenceSmall * 100) + (sportSettings?.confidenceRange * 100)} point={gameData.predictionConfidence * 100} pointLabel={`${(gameData.predictionConfidence * 100).toFixed(2)}%`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupCardExtendBetting;
