import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox'

const TeamOddsRow = (props) => {
    return (
        props.past ?
            <Row style={{ marginTop: 5, alignItems: 'center' }}>
                <Col xs={1}>
                    <img src={props.team.logo} style={{ width: '20px' }} alt='Team Logo' />
                </Col>
                <Col xs={7} style={{ alignContent: 'center' }}>
                    {props.team ? `${props.team.abbreviation} ${props.team.teamName}` : null}
                    <sup style={{ marginLeft: 5 }}>{props.teamIndex.toFixed(1)}</sup>
                </Col>
                <Col xs={3} style={{ fontSize: 'medium', borderStyle: 'solid', textAlign: 'center' }}>
                    {props.score}
                </Col>
            </Row>
            :
            <Row style={{ marginTop: 5, alignItems: 'center', fontSize: '12px' }}>
                <Col xs={1}>
                    <img src={props.team.logo} style={{ width: '20px' }} alt='Team Logo' />
                </Col>
                <Col xs={7} style={{ alignContent: 'center', fontSize: '10px' }}>
                    {props.team ? `${props.team.abbreviation} ${props.team.teamName}` : null}
                    <sup style={{ marginLeft: 5 }}>{props.teamIndex.toFixed(1)}</sup>
                </Col>
                <OddsDisplayBox teamIndex={props.teamIndex} key={`${props.team.espnDisplayName} h2h`} team={props.team} oppTeam={props.oppTeam} gameData={props.gameData} sportsbook={props.sportsbook} market='h2h' total={props.total} />
                <Col xs={1} style={{ alignContent: 'center' }}>
                    {props.gameData.bookmakers.map((bookmaker) => {
                        if (bookmaker.key === props.sportsbook) {
                            return (
                                bookmaker.markets.map((market) => {
                                    if (market.key === props.market) {
                                        return (
                                            market.outcomes.map((outcome) => {
                                                let outcomeSplit = outcome.name.split(" ")
                                                let espnNameSplit = props.team.espnDisplayName.split(" ")
                                                let kelleyCriterion = ((((outcome.price / 100) + 1) - 1) * props.winPercent - (1 - props.winPercent)) / (((outcome.price / 100) + 1) - 1)
                                                if (outcome && outcome.name === props.team.espnDisplayName) {
                                                    return props.teamIndex > props.oppteamIndex ? `$${((kelleyCriterion * props.bankroll) * .25).toFixed(2)}` : null
                                                } else if (outcome.name === props.total) {
                                                    return props.teamIndex > props.oppteamIndex ? `$${((kelleyCriterion * props.bankroll) * .25).toFixed(2)}` : null
                                                } else if (outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
                                                    return props.teamIndex > props.oppteamIndex ? `$${((kelleyCriterion * props.bankroll) * .25).toFixed(2)}` : null
                                                }
                                            })
                                        )
                                    }
                                })
                            )
                        }
                    })}
                </Col>
            </Row>
    )
}

export default TeamOddsRow