import { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'
import moment from 'moment'



const UpcomingGames = (props) => {
    const [displaySport, setDisplaySport] = useState()
    const [NFLScores, setNFLScores] = useState()
    const [NHLScores, setNHLScores] = useState()
    const [NBAScores, setNBAScores] = useState()
    const [EPLScores, setEPLScores] = useState()
    const [MMAScores, setMMAScores] = useState()
    const [MLSScores, setMLSScores] = useState()
    const [MLBScores, setMLBScores] = useState()
    const [pageIndex, setpageIndex] = useState({ NHL: { start: 0, end: 6 }, NBA: { start: 0, end: 6 } })
    let today = new Date(Date.now())
    let startDate = moment(today).format('YYYYMMDD')
    let endDate = moment(today.setDate(today.getDate() + 2)).format('YYYYMMDD')
    const now = moment()
    console.log(startDate)

    function findUpcomingGames() {
        let sports = [
            {
                sport: 'football',
                league: 'nfl',
                startMonth: 9,
                endMonth: 1,
            },
            {
                sport: 'soccer',
                league: 'eng.1',
                startMonth: 8,
                endMonth: 5,
            },
            {
                sport: 'soccer',
                league: 'mls',
                startMonth: 2,
                endMonth: 10,
            },
            {
                sport: 'baseball',
                league: 'mlb',
                startMonth: 3,
                endMonth: 10,
            },
            {
                sport: 'basketball',
                league: 'nba',
                startMonth: 10,
                endMonth: 4,
            },
            {
                sport: 'hockey',
                league: 'nhl',
                startMonth: 10,
                endMonth: 4,
            },
            {
                sport: 'mma',
                league: 'ufc',
                startMonth: 12,
                endMonth: 12,
            }
        ]
        let searchSports = []
        sports.map((sport) => {
            if (sport.endMonth < sport.startMonth) { //if true, sport has multi year season
                if (now.month() + 1 >= sport.startMonth || now.month() + 1 <= sport.endMonth) {
                    searchSports.push(sport)
                }
            } else if (sport.startMonth === sport.endMonth) { // if true, sport is year round
                searchSports.push(sport)
            } else { // else case covers single year seasons
                if (now.month() + 1 <= sport.startMonth && now.month() + 1 >= sport.endMonth) {
                    searchSports.push(sport)
                }
            }
        })

        let dataJSON
        let data
        let newData

        searchSports.map(async (sport) => {
            switch (sport.sport) {
                case 'football':
                    data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                    dataJSON = await data.json()
                    newData =  dataJSON.events.filter((event) => {
                        return event.status.type.id < 3

                    })
                    setNFLScores(newData)
                    break;
                case 'soccer':
                    if (sport.league === 'eng.1') {
                        data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                        dataJSON = await data.json()
                        newData =  dataJSON.events.filter((event) => {
                            return event.status.type.id < 3
    
                        })
                        setEPLScores(newData)
                    } else {
                        data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                        dataJSON = await data.json()
                        newData =  dataJSON.events.filter((event) => {
                            return event.status.type.id < 3
    
                        })
                        setMLSScores(newData)
                    }
                    break;
                case 'baseball':
                    data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                    dataJSON = await data.json()
                    newData =  dataJSON.events.filter((event) => {
                        return event.status.type.id < 3

                    })
                    setMLBScores(newData)
                    break;
                case 'basketball':
                    data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                    dataJSON = await data.json()
                   newData =  dataJSON.events.filter((event) => {
                        return event.status.type.id < 3

                    })
                    setNBAScores(newData)
                    break;
                case 'hockey':
                    data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${sport.league}/scoreboard?dates=${startDate}-${endDate}`)
                    dataJSON = await data.json()
                    newData =  dataJSON.events.filter((event) => {
                        return event.status.type.id < 3

                    })
                    setNHLScores(newData)
                    break;
                case 'mma':
                    data = await fetch(`https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard`)
                    dataJSON = await data.json()
                    newData =  dataJSON.events.filter((event) => {
                        return event.status.type.id < 3

                    })
                    setMMAScores(newData)
                    break;
            }
        })
    }

    const handlepageUpClick = (e) => {
        let newStartIndex = pageIndex[e.target.id].start + 6
        let newEndIndex = pageIndex[e.target.id].end + 6
        setpageIndex({
            ...pageIndex,
            [e.target.id]: {
                start: newStartIndex,
                end: newEndIndex
            },
        })
    }

    const handlepageDownClick = (e) => {
        let newStartIndex = pageIndex[e.target.id].start - 6
        let newEndIndex = pageIndex[e.target.id].end - 6
        setpageIndex({
            ...pageIndex,
            [e.target.id]: {
                start: newStartIndex,
                end: newEndIndex
            },
        })

    }

    useEffect(() => {
        findUpcomingGames()
        console.log(NBAScores)
    }, [pageIndex])


    return (

        <Container style={{ paddingTop: 70 }} fluid >



            {NHLScores ? <Row>
                <Row><Col>NHL</Col><Col>See More</Col></Row>
                {pageIndex.NHL.start <= 0 ? <Col><Button id="NHL" style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Prev</Button></Col> : <Col><Button id="NHL" onClick={handlepageDownClick}>Next</Button></Col>}
                {NHLScores.slice(pageIndex.NHL.start, pageIndex.NHL.end).map((event) => { return (<Col><MatchupCard pageIndex={pageIndex} sportsBook={props.sportsBook} eventData={event} sport="hockey" league="nhl" /></Col>) })}
                {pageIndex.NHL.end >= NHLScores.length ? <Col><Button id="NHL" style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Next</Button></Col> : <Col><Button id="NHL" onClick={handlepageUpClick}>Next</Button></Col>}
            </Row> : null}
            { NBAScores ?  <Row>
                <Row><Col>NBA</Col><Col>See More</Col></Row>
                {pageIndex.NBA.start <= 0 ? <Col><Button id="NBA" style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Prev</Button></Col> : <Col><Button id="NBA" onClick={handlepageDownClick}>Next</Button></Col>}
                {NBAScores.slice(pageIndex.NBA.start, pageIndex.NBA.end).map((event) => { return (event.competitions[0].type.id == 4 ? null : <Col><MatchupCard pageIndex={pageIndex} sportsBook={props.sportsBook} eventData={event} sport="basketball" league="nba" /></Col>) })}
                {pageIndex.NBA.end >= NBAScores.length ? <Col><Button id="NBA" style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Next</Button></Col> : <Col><Button id="NBA" onClick={handlepageUpClick}>Next</Button></Col>}
            </Row> : null}
            <Row>
                {EPLScores ? EPLScores.slice(0, 12).map((event) => { return (<Col><MatchupCard sportsBook={props.sportsBook} eventData={event} sport="soccer" league="eng.1" /></Col>) }) : null}
            </Row>



        </Container>
    )
}

export default UpcomingGames