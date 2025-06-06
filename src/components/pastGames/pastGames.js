
import { Row, Col } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'


const PastGamesDisplay = ({ displayGames }) => {




    return (
        <Row>
            <Col xs={6}>
                <Row>
                    <Col>{`Wins (${displayGames.filter((game) => game.predictionCorrect === true).length})`}</Col>
                </Row>
                <Row style={{maxHeight: '14em',overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'white'}}>
                    {displayGames.filter((game) => game.predictionCorrect === true).map((game) => {
                        return (

                            <Col style={{ padding: 0, margin: '.5em 0' }}>
                                <MatchupCard
                                    gameData={game}
                                />
                            </Col>

                        )
                    })}
                </Row>
            </Col>
            <Col xs={6}>
                <Row>
                    <Col>{`Losses (${displayGames.filter((game) => game.predictionCorrect === false).length})`}</Col>
                </Row>
                <Row style={{maxHeight: '14em',overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'white'}}>
                    {displayGames.filter((game) => game.predictionCorrect === false).map((game) => {
                        return (
                            <Col style={{ padding: 0, margin: '.5em 0' }}>
                                <MatchupCard
                                    gameData={game}
                                />
                            </Col>
                        )
                    })}
                </Row>
            </Col>
        </Row>
    );
}

export default PastGamesDisplay;
