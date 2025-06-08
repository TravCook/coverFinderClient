import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector} from 'react-redux';
import React from 'react';
import NumberLine from '../numberLine/numberLine';
import WinrateVsProbabilityBar from '../winrateVsProbabilityBar/winRateVsProbabilityBar.js';

const MatchupCardExtendBetting = ({ gameData }) => {
    const { sportsbook } = useSelector((state) => state.user);
    const [bestSportsbook, setBestSportsbook] = useState();
    const { sports } = useSelector((state) => state.games);
    const [sportSettings, setSportSettings] = useState();
    const indexDiff = gameData.predictedWinner === 'home' ? gameData.homeTeamScaledIndex - gameData.awayTeamScaledIndex : gameData.awayTeamScaledIndex - gameData.homeTeamScaledIndex

    function sortBookmakersByOutcomePrice(bookmakers, teamName) {
        return bookmakers.sort((a, b) => {
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
            setSportSettings(sport.valueBetSettings.find((setting) => setting.bookmaker === sportsbook));
        }
        const sortedBookmakers = sortBookmakersByOutcomePrice(gameData.bookmakers, gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName);
        if (sortedBookmakers.length > 0) {
            setBestSportsbook(sortedBookmakers[0].key);
        }

       
    }, [gameData, bestSportsbook, sports, sportsbook]);
    return (
        <div>
            <Row style={{ borderBottom: '2px solid white', padding: 5 }}>
                <Col style={{ fontSize: '1rem', textAlign: 'center' }}>{`Pick: ${gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName}`}</Col>
            </Row>
            <Row>
                <Col>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Probability
                            </Col>
                        </Row>
                        <Row style={{ margin: 'auto' }}>
                            <WinrateVsProbabilityBar
                                internalWinrate={gameData.winPercent}
                                impliedProbability={gameData.bookmakers.find(b => b.key === sportsbook)?.markets.find(m => m.key === 'h2h').outcomes.find(o => o.name === (gameData.predictedWinner === 'home' ? gameData.homeTeamDetails.espnDisplayName : gameData.awayTeamDetails.espnDisplayName))?.impliedProbability * 100}
                            />
                        </Row>
                    </Row>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Index Delta
                            </Col>
                        </Row>
                        <Row style={{ margin: 'auto' }}>
                            <NumberLine min={-50} max={50} rangeStart={sportSettings?.settings.indexDiffSmallNum} rangeEnd={sportSettings?.settings.indexDiffSmallNum + sportSettings?.settings.indexDiffRangeNum} point={indexDiff} pointLabel={indexDiff.toFixed(2)} />
                            <NumberLine min={-50} max={50} rangeStart={sportSettings?.settings.indexDiffSmallNum} rangeEnd={sportSettings?.settings.indexDiffSmallNum + sportSettings?.settings.indexDiffRangeNum} point={indexDiff} pointLabel={indexDiff.toFixed(2)} />
                        </Row>
                    </Row>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Confidence
                            </Col>
                        </Row>
                        <Row style={{ margin: 'auto' }}>
                            <NumberLine min={50} max={100} rangeStart={sportSettings?.settings.confidenceLowNum * 100} rangeEnd={(sportSettings?.settings.confidenceLowNum * 100) + (sportSettings?.settings.confidenceRangeNum * 100)} point={gameData.predictionConfidence * 100} pointLabel={`${(gameData.predictionConfidence * 100).toFixed(2)}%`} />
                        </Row>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default MatchupCardExtendBetting;
