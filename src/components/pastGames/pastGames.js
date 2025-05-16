
import { Row, Col } from 'react-bootstrap'
import MatchupCard from '../matchupCard/matchupCard.js'


const PastGamesDisplay = ({ displayGames }) => {




    return (
        <Row style={{paddingLeft: '1em'}}>
            <Col xs={6}>
                <Row style={{ display: 'flex', justifyContent: 'space-around', maxHeight: 330, overflowY: 'scroll'}}>
                    {displayGames.filter((game) => game.predictionCorrect === true).map((game) => {
                        return (
                            
                            <MatchupCard gameData={game} final={true} />

                        )
                    })}
                </Row>
            </Col>
            <Col xs={6}>
                <Row style={{ display: 'flex', justifyContent: 'space-around', maxHeight: 330, overflowY: 'scroll'}}>
                    {displayGames.filter((game) => game.predictionCorrect === false).map((game) => {
                        return (
                            <MatchupCard gameData={game} final={true} />
                        )
                    })}
                </Row>
            </Col>



        </Row>
    );
}

export default PastGamesDisplay;
