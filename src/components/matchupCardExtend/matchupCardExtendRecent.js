import { useState } from 'react';
import RecentGames from '../recentGames/recentGames';
import { Button, Col, Row } from 'react-bootstrap';

const MatchupCardExtendRecent = ({ gameData }) => {
    const [displayTeam, setDisplayTeam] = useState(gameData.home_team);

    const handleTeamClick = (e) => {
        if(e.target.innerText === gameData.awayTeamAbbr) {
            setDisplayTeam(gameData.away_team);
        }else if(e.target.innerText === gameData.homeTeamAbbr) {
            setDisplayTeam(gameData.home_team);
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button onClick={handleTeamClick}>
                        {gameData.awayTeamAbbr}
                    </Button>
                </Col>
                <Col>
                    <Button onClick={handleTeamClick}>
                        {gameData.homeTeamAbbr}
                    </Button>
                </Col>
            </Row>
            <RecentGames team={displayTeam} />
        </div>

    )
}

export default MatchupCardExtendRecent;