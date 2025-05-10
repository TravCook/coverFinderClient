import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import NumberLine from '../numberLine/numberLine';
import WinrateVsProbabilityBar from '../winrateVsProbabilityBar/winRateVsProbabilityBar.js';

const MatchupCardExtendBetting = ({ gameData }) => {
    const { sportsbook } = useSelector((state) => state.user);
    const [bestSportsbook, setBestSportsbook] = useState();
    const [impliedProb, setImpliedProb] = useState();
    const [bestImpliedProb, setBestImpliedProb] = useState();
    const [selectedOdds, setSelectedOdds] = useState();
    const { sports } = useSelector((state) => state.games);
    const [indexDiff, setIndexDiff] = useState(Math.abs(gameData.predictedWinner === 'home' ? gameData.homeTeamScaledIndex - gameData.awayTeamScaledIndex : gameData.awayTeamScaledIndex - gameData.homeTeamScaledIndex));
    const [sportSettings, setSportSettings] = useState();

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

    const fetchImpliedProbs = () => {
        const bookmaker = gameData?.bookmakers?.find(b => b.key === sportsbook);
        const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');

        marketData?.outcomes?.find(o => {
            if (o.name === (gameData.predictedWinner === 'home' ? gameData.home_team : gameData.away_team)) {
                setSelectedOdds(o?.price);
                setImpliedProb(o?.impliedProb * 100);
            }
        });

        const bestBookmaker = gameData?.bookmakers?.find(b => b.key === bestSportsbook);
        const bestMarketData = bestBookmaker?.markets?.find(m => m.key === 'h2h');

        bestMarketData?.outcomes?.find(o => {
            if (o.name === (gameData.predictedWinner === 'home' ? gameData.home_team : gameData.away_team)) {
                setBestImpliedProb(o.impliedProb * 100);
            }
        });
    };

    useEffect(() => {
        let sport = sports.find(s => s.name === gameData.sport_key);
        if (sport) {
            setSportSettings(sport.valueBetSettings.find((setting) => setting.bookmaker === sportsbook));
        }

        const sortedBookmakers = sortBookmakersByOutcomePrice(gameData.bookmakers, gameData.predictedWinner === 'home' ? gameData.home_team : gameData.away_team);
        if (sortedBookmakers.length > 0) {
            setBestSportsbook(sortedBookmakers[0].key);
        }

        if (bestSportsbook) {
            fetchImpliedProbs();
        }
    }, [gameData, bestSportsbook, sports]);

    return (
        <div>
            <Row style={{ borderBottom: '2px solid white', padding: 5 }}>
                <Col style={{ fontSize: '1rem', textAlign: 'center' }}>{`Pick: ${gameData.predictedWinner === 'home' ? gameData.home_team : gameData.away_team}`}</Col>
            </Row>
            <Row>
                <Col>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Probability
                            </Col>
                        </Row>
                        <Row>
                            <WinrateVsProbabilityBar
                                internalWinrate={gameData.winPercent}
                                impliedProbability={impliedProb}
                            />
                        </Row>
                    </Row>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Index Delta
                            </Col>
                        </Row>
                        <Row>
                            <NumberLine min={0} max={45} rangeStart={sportSettings?.settings.indexDiffSmallNum} rangeEnd={sportSettings?.settings.indexDiffSmallNum + sportSettings?.settings.indexDiffRangeNum} point={indexDiff} pointLabel={indexDiff.toFixed(2)} />
                        </Row>
                    </Row>
                    <Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col>
                                Confidence
                            </Col>
                        </Row>
                        <Row>
                            <NumberLine min={50} max={100} rangeStart={sportSettings?.settings.confidenceLowNum * 100} rangeEnd={(sportSettings?.settings.confidenceLowNum * 100) + (sportSettings?.settings.confidenceRangeNum * 100)} point={gameData.predictionStrength * 100} pointLabel={`${(gameData.predictionStrength * 100).toFixed(2)}%`} />
                        </Row>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default MatchupCardExtendBetting;
