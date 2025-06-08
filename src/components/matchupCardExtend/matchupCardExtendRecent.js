import { useState } from 'react';
import RecentGames from '../recentGames/recentGames';
import { Button, Col, Row } from 'react-bootstrap';

const MatchupCardExtendRecent = ({ gameData }) => {
    const [displayTeam, setDisplayTeam] = useState(gameData.homeTeamDetails.espnDisplayName);

    const handleTeamClick = (e) => {
        if(e.target.innerText === gameData.awayTeamDetails.abbreviation) {
            setDisplayTeam(gameData.homeTeamDetails.espnDisplayName);
        }else if(e.target.innerText === gameData.homeTeamDetails.abbreviation) {
            setDisplayTeam(gameData.awayTeamDetails.espnDisplayName);
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button onClick={handleTeamClick}>
                        {gameData.awayTeamDetails.abbreviation}
                    </Button>
                </Col>
                <Col>
                    <Button onClick={handleTeamClick}>
                        {gameData.homeTeamDetails.abbreviation}
                    </Button>
                </Col>
            </Row>
            <RecentGames team={displayTeam} />
        </div>

    )
}

export default MatchupCardExtendRecent;