import { useEffect, useState } from 'react'
import { Col, } from 'react-bootstrap'
import moment from 'moment'

const OddsDisplayBox = (props) => {
    const [h2hIndex, seth2hIndex] = useState(0)
    const [spreadIndex, setspreadIndex] = useState(0)
    const [totalsIndex, settotalsIndex] = useState(0)
    const [indexColor, setIndexColor] = useState()

    const indexSaver = (market, team, index) => {
        fetch('http://localhost:3001/api/teams/saveIndex', {
            method: 'POST',
            body: JSON.stringify({
                searchTeam: team,
                market: market,
                index: index,
                updatedAt: moment()
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const indexFinder = () => {
        let index=0
        
        switch(props.market){  //determine market
            case 'h2h':
                //determine if index is old enough to ReCalculate
                if(moment(props.team.h2hIndexUpdatedAt).diff(moment(), "hours") > 24){
                    //determine home and away indexes 
                    if (props.gameData.home_team === props.team.espnDisplayName) { //home team
                        props.team.homeWinLoss.split("-")[0] > props.oppTeam.awayWinLoss.split("-")[0] ? index++ : index--
                    }
                    else if (props.gameData.away_team === props.team.espnDisplayName) { //away team
                        props.team.awayWinLoss.split("-")[0] > props.oppTeam.homeWinLoss.split("-")[0] ? index++ : index--
                    }
                    props.team.seasonWinLoss.split("-")[0] > props.oppTeam.seasonWinLoss.split("-")[0] ? index++ : index-- //total win loss
                    if (props.gameData.sport_key === 'americanfootball_nfl') {//determine stat indexes
                        props.team.thirdDownConvRate > props.oppTeam.thirdDownConvRate ? index++ : index--//third down conv rate
                        props.team.yardsPerPlay > props.oppTeam.yardsPerPlay ? index++ : index--//yards per play
                        props.team.yardsAllowedPerGame < props.oppTeam.yardsAllowedPerGame ? index++ : index--//yards allowed per game
                        props.team.giveawaysPerGame < props.oppTeam.giveawaysPerGame ? index++ : index--//giveaways per game
                        props.team.takeawaysPerGame > props.oppTeam.takeawaysPerGame ? index++ : index--//takeaways per game
                        props.team.avgTimeofPossessionPerGame > props.oppTeam.avgTimeofPossessionPerGame ? index++ : index--//time of possession
                        props.team.penYardsPerGame < props.oppTeam.penYardsPerGame ? index++ : index--//penalty yards per game
                    } else if (props.gameData.sport_key === 'icehockey_nhl') {

                        // props.team.hits > props.oppTeam.hits ? index++ : index-- // xGoals
                        // props.team.hits > props.oppTeam.hits ? index++ : index-- // xGoalsAgainst
                        props.team.faceoffsWon > props.oppTeam.faceoffsWon ? index++ : index-- // faceoffsWon
                        props.team.giveaways < props.oppTeam.giveaways ? index++ : index-- // giveaways
                        props.team.penaltiesInMinutes < props.oppTeam.penaltiesInMinutes ? index++ : index-- // PIM
                        props.team.savePct > props.oppTeam.savePct ? index++ : index--// save percent
                        props.team.shotsAgainst < props.oppTeam.shotsAgainst ? index++ : index-- // shotsAgainst
                        props.team.shotsBlocked > props.oppTeam.shotsBlocked ? index++ : index-- // shotsBlocked
                        props.team.takeaways > props.oppTeam.takeaways ? index++ : index-- // takeAways
                    } else if (props.gameData.sport_key === 'basketball_nba') {
                        props.team.assistTurnoverRatio > props.oppTeam.assistTurnoverRatio ? index++ : index-- // assist to turnover ratio
                        props.team.blocksPerGame > props.oppTeam.blocksPerGame ? index++ : index-- // blocks per game
                        props.team.effectiveFieldGoalPct > props.oppTeam.effectiveFieldGoalPct ? index++ : index-- // effective fg percent
                        props.team.fieldGoalsAttempted > props.oppTeam.fieldGoalsAttempted ? index++ : index-- // field goals attempted
                        props.team.freeThrowPct > props.oppTeam.freeThrowPct ? index++ : index-- // free throw percent
                        props.team.reboundRate > props.oppTeam.reboundRate ? index++ : index-- // rebound rate
                        props.team.stealsPerGame > props.oppTeam.stealsPerGame ? index++ : index-- // steals per game
                        props.team.pace > props.oppTeam.pace ? index++ : index-- // pace
                    } else if (props.gameData.sport_key === 'baseball_mlb') {
                        props.team.hits > props.oppTeam.hits ? index++ : index-- //hits
                        props.team.runs > props.oppTeam.runs ? index++ : index--//runs
                        props.team.walks > props.oppTeam.walks ? index++ : index--//walks
                        props.team.homeRuns > props.oppTeam.hits ? index++ : index--//home runs
                        props.team.runsBattedIn > props.oppTeam.runsBattedIn ? index++ : index--//runsbattedin
                        props.team.strikeouts < props.oppTeam.strikeouts ? index++ : index--//strikeouts
                        props.team.fieldingErrors < props.oppTeam.fieldingErrors ? index++ : index--//fieldingErrors
                        props.team.fieldingPercentage > props.oppTeam.fieldingPercentage ? index++ : index--//fieldingPercentage
                        props.team.runsVsEra > props.oppTeam.runsVsEra ? index++ : index--//runsVsEra
                    }
                    if (props.team.winLossAsDog && props.team.winLossAsFav && props.oppTeam.winLossAsFav && props.oppTeam.winLossAsDog) { //determine odds indexes -hockey
                        {
                            props.gameData.bookmakers.map((bookmaker) => {
                                if (bookmaker.key === props.sportsbook) {
                                    return (
                                        bookmaker.markets.map((market) => {
                                            if (market.key === props.market) {
                                                return (
                                                    market.outcomes.map((outcome) => {
                                                        if (outcome.name === props.team.espnDisplayName && outcome.price < 0) {
                                                            props.team.winLossAsFav.split('-')[0] > props.oppTeam.winLossAsDog.split('-')[0] ? index++ : index--//win as fav
                                                        } else if (outcome.name === props.team.espnDisplayName && outcome.price > 0) {
                                                            props.team.winLossAsDog.split('-')[0] > props.oppTeam.winLossAsFav.split('-')[0] ? index++ : index--//win as dog
                                                        }
                                                    })
                                                )
                                            }
                                        })
                                    )
                                }
                            })
                        }
                    }
                    //save index to team one field for each
                    indexSaver(props.market, props.team._id, index) 
                    seth2hIndex(index)
                }else{
                    seth2hIndex(props.team.h2hIndex)
                }
              break
            case 'spreads':
            //save index to team one field for each
              break
            case 'totals':
            //save index to team one field for each
              break
        }       
    }

    let indexColors=[{
        key: -10,
        hexCode: '#f20707', 
    },{
        key: -9,
        hexCode: '#f32b08', 
    },{
        key: -8,
        hexCode: '#f33b09', 
    },{
        key: -7,
        hexCode: '#f34e0a', 
    },{
        key: -6,
        hexCode: '#f3600a', 
    },{
        key: -5,
        hexCode: '#f4750b', 
    },{
        key: -4,
        hexCode: '#f48a0b', 
    },{
        key: -3,
        hexCode: '#f5a40c', 
    },{
        key: -2,
        hexCode: '#f5be0d', 
    },{
        key: -1,
        hexCode: '#f5d80e', 
    },{
        key: 0,
        hexCode: '#f5f20e', 
    },{
        key: 1,
        hexCode: '#f5df0e', 
    },{
        key: 2,
        hexCode: '#f5cc0d', 
    },{
        key: 3,
        hexCode: '#d2d50b', 
    },{
        key: 4,
        hexCode: '#aede09', 
    },{
        key: 5,
        hexCode: '#9ae308', 
    },{
        key: 6,
        hexCode: '#77ec05', 
    },{
        key: 7,
        hexCode: '#6bef04', 
    },{
        key: 8,
        hexCode: '#59f403', 
    },{
        key: 9,
        hexCode: '#47f802', 
    },{
        key: 10,
        hexCode: '#2cff00', 
    },]

    const colorPicker = () => {
        indexColors.map((color) => {
            if(color.key === h2hIndex){
                setIndexColor(color.hexCode)
            }
        })
    }

    useEffect(() => {
        props.team && props.oppTeam ? indexFinder() : <></>
    }, [props.team, props.oppTeam])

    useEffect(() => {
        colorPicker()
    }, [h2hIndex])
    
    return (
        <Col xs={2} style={{ textAlign: 'center', alignContent: 'center', padding: '5px', borderStyle: 'solid', boxShadow:`inset 0 0 10px ${indexColor}` }}>
            {props.gameData.bookmakers.map((bookmaker) => {
                if(bookmaker.key === props.sportsbook){
                    return(
                        bookmaker.markets.map((market) => {
                            if(market.key === props.market){
                                return(
                                    market.outcomes.map((outcome) =>{
                                        if(outcome.name === props.team.espnDisplayName){
                                            return outcome.price < 0 ? outcome.price : `+${outcome.price}`
                                        }else if(outcome.name === props.total){
                                            return outcome.price < 0 ? outcome.price : `+${outcome.price}`
                                        }
                                    })
                                )
                            }
                        })
                    )
                }
            })}
        </Col>


    )
}

export default OddsDisplayBox