import { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { allStatLabelsShort } from '../../utils/constants';

const MatchupCardExtendStats = ({ gameData }) => {
    const [awayStatIndex, setAwayStatIndex] = useState(0)
    const [homeStatIndex, setHomeStatIndex] = useState(0)
    const handleHomeStatIncrease = () => {
        setHomeStatIndex(homeStatIndex + 1)
    }

    const handleHomeStatDecrease = () => {
        setHomeStatIndex(homeStatIndex - 1)
    }

    const handleAwayStatIncrease = () => {
        setAwayStatIndex(awayStatIndex + 1)
    }

    const handleAwayStatDecrease = () => {
        setAwayStatIndex(awayStatIndex - 1)
    }

    const highestStat = (teamStats, oppStats, team, homeAway) => {
        let advStats = []
        for (const stat in teamStats) {
            if (stat === 'seasonWinLoss') {
                let splitArr = teamStats[stat].split("-")
                let oppSplitArr = oppStats[stat].split("-")
                let oppWins = oppSplitArr[0]
                let wins = splitArr[0]
                if (oppStats[stat] !== 0 && wins > oppWins) {
                    advStats.push({
                        stat: allStatLabelsShort[stat],
                        adv: wins / oppWins,
                        value: teamStats[stat],
                        oppValue: oppStats[stat]
                    })
                }
            } else if (stat === 'homeWinLoss' || stat === 'awayWinLoss') {
                if (stat === 'homeWinLoss' && team === gameData.home_team) {
                    let splitArr = teamStats[stat].split("-")
                    let oppSplitArr = oppStats['awayWinLoss'].split("-")
                    let oppWins = parseInt(oppSplitArr[0])
                    let wins = parseInt(splitArr[0])
                    if (oppStats[stat] !== 0 && wins > oppWins) {
                        advStats.push({
                            stat: allStatLabelsShort[stat],
                            adv: wins / oppWins,
                            value: teamStats[stat],
                            oppValue: oppStats['awayWinLoss']
                        })
                    }
                } else if (stat === 'awayWinLoss' && team === gameData.away_team) {
                    let splitArr = teamStats[stat].split("-")
                    let oppSplitArr = oppStats['homeWinLoss'].split("-")
                    let oppWins = parseInt(oppSplitArr[0])
                    let wins = parseInt(splitArr[0])
                    if (oppStats[stat] !== 0 && wins > oppWins) {
                        advStats.push({
                            stat: allStatLabelsShort[stat],
                            adv: wins / oppWins,
                            value: teamStats[stat],
                            oppValue: oppStats['homeWinLoss']
                        })
                    }
                }

            } else if (oppStats[stat] !== 0 && teamStats[stat] > oppStats[stat]) {
                advStats.push({
                    stat: allStatLabelsShort[stat],
                    adv: teamStats[stat] / oppStats[stat],
                    value: teamStats[stat],
                    oppValue: oppStats[stat]
                })
            }
        }
        let sortedStatArr = advStats.sort((a, b) => b.adv - a.adv)
        if (sortedStatArr.length > 0) {
            return (
                <>
                    {homeAway === 'home' ?
                        <>
                            <Row style={{ textAlign: 'center' }}>
                                <Col xs={3} style={{ padding: 0 }}>
                                    {<Button style={{ padding: 0, }} onClick={handleHomeStatDecrease} disabled={homeStatIndex === 0}>←</Button>}
                                </Col>
                                <Col xs={6} style={{ padding: 0 }}>{sortedStatArr[homeStatIndex].stat}</Col>
                                <Col xs={3} style={{ padding: 0 }}>
                                    {<Button style={{ padding: 0 }} onClick={handleHomeStatIncrease} disabled={homeStatIndex >= advStats.length - 1}>→</Button>}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={8} style={{ textAlign: 'center', padding: 0 }}>
                                    Amount
                                </Col>
                                <Col style={{ textAlign: 'center', padding: 0 }}>
                                    Adv Δ
                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'center' }}>
                                <Col style={{ padding: 0 }}>
                                    {typeof sortedStatArr[homeStatIndex].value == 'number' ? sortedStatArr[homeStatIndex].value > 100 ? sortedStatArr[homeStatIndex].value.toFixed(0) : sortedStatArr[homeStatIndex].value.toFixed(2) : sortedStatArr[homeStatIndex].value}
                                </Col>
                                <Col style={{ padding: 0 }}>
                                    {typeof sortedStatArr[homeStatIndex].oppValue === 'number' ? sortedStatArr[homeStatIndex].oppValue > 100 ? sortedStatArr[homeStatIndex].oppValue.toFixed(0) : sortedStatArr[homeStatIndex].oppValue.toFixed(2) : sortedStatArr[homeStatIndex].oppValue}
                                </Col>
                                <Col style={{ padding: 0 }}>
                                    {`${Math.abs(((sortedStatArr[homeStatIndex].adv - 1) * 100).toFixed(1))}%`}
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            <Row style={{ textAlign: 'center' }}>
                                <Col xs={3} style={{ padding: 0 }}>
                                    {<Button style={{ padding: 0 }} onClick={handleAwayStatDecrease} disabled={awayStatIndex === 0}>←</Button>}
                                </Col>
                                <Col xs={6} style={{ padding: 0 }}>{sortedStatArr[awayStatIndex].stat}</Col>
                                <Col xs={3} style={{ padding: 0 }}>
                                    {<Button style={{ padding: 0 }} onClick={handleAwayStatIncrease} disabled={awayStatIndex >= advStats.length - 1}>→</Button>}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={8} style={{ textAlign: 'center', padding: 0 }}>
                                    Amount
                                </Col>
                                <Col style={{ textAlign: 'center', padding: 0 }}>
                                    Adv Δ
                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'center' }}>
                                <Col style={{ padding: 0 }}>
                                    {typeof sortedStatArr[awayStatIndex].value == 'number' ? sortedStatArr[awayStatIndex].value > 100 ? sortedStatArr[awayStatIndex].value.toFixed(0) : sortedStatArr[awayStatIndex].value.toFixed(2) : sortedStatArr[awayStatIndex].value}
                                </Col>
                                <Col style={{ padding: 0 }}>
                                    {typeof sortedStatArr[awayStatIndex].oppValue === 'number' ? sortedStatArr[awayStatIndex].oppValue > 100 ? sortedStatArr[awayStatIndex].oppValue.toFixed(0) : sortedStatArr[awayStatIndex].oppValue.toFixed(2) : sortedStatArr[awayStatIndex].oppValue}
                                </Col>
                                <Col style={{ padding: 0 }}>
                                    {`${((sortedStatArr[awayStatIndex].adv - 1) * 100).toFixed(1)}%`}
                                </Col>
                            </Row>
                        </>}

                </>
            )
        } else {
        }
    }

    const getColorForIndex = (index) => {
        let hue = (index / 45) * 120; // Scale from 0 to 120 degrees
        return `hsl(${hue}, 100%, 50%)`; // Full saturation and lightness at 50%
    };
    return (
        <div>
            <Row style={{ borderBottom: '2px solid white', padding: 5 }}>
                <Col style={{
                    fontSize: '.9rem',
                    paddingLeft: 5,
                    paddingRight: 5,
                    textAlign: 'center'
                }}>
                    <Row>
                        <Col style={{ fontSize: '.8rem' }}>Winrate</Col>
                    </Row>
                    <Row>
                        {gameData.winPercent && <Col style={{ fontSize: '.8rem' }}>{`${gameData.winPercent.toFixed(2)}%`}</Col>}
                    </Row>

                </Col>
                <Col style={{
                    fontSize: '.9rem',
                    paddingLeft: 5,
                    paddingRight: 5,
                    textAlign: 'center'
                }}>
                    <Row>
                        <Col style={{ fontSize: '.8rem' }}>BBI Δ</Col>
                    </Row>
                    <Row>
                        {(gameData.predictedWinner) && <Col style={{ fontSize: '.8rem' }}>{`${Math.abs(gameData.predictedWinner === 'home' ? gameData.homeTeamScaledIndex - gameData.awayTeamScaledIndex : gameData.awayTeamScaledIndex - gameData.homeTeamScaledIndex).toFixed(2)}`}</Col>}
                    </Row>

                </Col>
                <Col style={{
                    fontSize: '.9rem',
                    paddingLeft: 5,
                    paddingRight: 5,
                    textAlign: 'center'
                }}>
                    <Row>
                        <Col style={{ fontSize: '.8rem', padding: 0 }}>Confidence</Col>
                    </Row>
                    <Row>
                        <Col style={{ fontSize: '.8rem' }}>{`${(gameData.predictionStrength * 100).toFixed(2)}%`}</Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
                <Col xs={6}>
                    <Row style={{ alignItems: 'center', textAlign: 'center' }}>
                        <Col xs={4} style={{ padding: 5, textAlign: 'left' }}>
                            <img style={{ width: '100%', maxWidth: '1.5rem' }} src={gameData.awayTeamlogo} />
                            {gameData.awayTeamAbbr}
                        </Col>
                        <Col xs={6} style={{ boxShadow: `inset 0 0 13px ${getColorForIndex(gameData.awayTeamScaledIndex ? gameData.awayTeamScaledIndex : 0)}`, borderRadius: '.5rem' }}>
                            {gameData.awayTeamScaledIndex && gameData.awayTeamScaledIndex.toFixed(2).padEnd(4, '0')}
                        </Col>
                    </Row>

                </Col>

                <Col xs={6}>
                    {gameData.homeTeamStats != 'no stat data' && gameData.awayTeamStats != 'no stat data' && highestStat(gameData.awayTeamStats, gameData.homeTeamStats, gameData.away_team, 'away')}
                </Col>
            </Row>
            <Row style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
                <Col xs={6}>
                    <Row style={{ alignItems: 'center', textAlign: 'center' }}>
                        <Col xs={4} style={{ padding: 5, textAlign: 'left' }}>
                            <img style={{ width: '100%', maxWidth: '1.5rem' }} src={gameData.homeTeamlogo} />
                            {gameData.homeTeamAbbr}
                        </Col>
                        <Col xs={6} style={{ boxShadow: `inset 0 0 13px ${getColorForIndex(gameData.homeTeamScaledIndex ? gameData.homeTeamScaledIndex : 0)}`, borderRadius: '.5rem' }}>
                            {gameData.homeTeamScaledIndex && gameData.homeTeamScaledIndex.toFixed(2).padEnd(4, '0')}
                        </Col>
                    </Row>

                </Col>
                <Col>
                    {gameData.homeTeamStats != 'no stat data' && gameData.awayTeamStats != 'no stat data' && highestStat(gameData.homeTeamStats, gameData.awayTeamStats, gameData.home_team, 'home')}
                </Col>

            </Row>

        </div>
    );
}

export default MatchupCardExtendStats;