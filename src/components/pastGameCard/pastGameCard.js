import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TeamOddsRow from '../teamOddsRow/teamOddsRow';
import moment from 'moment';

const PastGameCard = (props) => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch team data based on the team's name
  const fetchTeamData = (teamName, setTeam) => {
    fetch('http://localhost:3001/api/teams/search', {
      method: 'POST',
      body: JSON.stringify({ searchTeam: teamName, sport: props.gameData.sport }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setTeam(data);
        } else {
          setTeam(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
        setTeam(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (props.gameData.home_team && props.gameData.away_team) {
      fetchTeamData(props.gameData.home_team, setHomeTeam);
      fetchTeamData(props.gameData.away_team, setAwayTeam);
    }
  }, [props.gameData]);

  // Set background color based on prediction correctness
  const backgroundColor = props.gameData.predictionCorrect ? '#06402B' : '#4d0000';

  return (
    <div style={{ ...styles.card, backgroundColor }}>
      <Row>
        <Col style={styles.timeColumn}>
          {moment(props.gameData.commence_time).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY')
            ? `Today @ ${moment(props.gameData.commence_time).utc().local().format('h:MMa')}`
            : moment(props.gameData.commence_time).utc().local().format('MMM/DD @ h:MMa')}
        </Col>
        <Col style={styles.winPercentColumn}>
          {props.gameData.winPercent === 0 ? `${(props.gameData.winPercent * 100).toFixed(2)}%` : props.gameData.winPercent ? `${(props.gameData.winPercent * 100).toFixed(2)}%` : 'Loading...'}
        </Col>
      </Row>

      {/* Conditional Rendering for Teams */}
      {loading ? (
        <Row>
          <Col style={styles.loadingColumn}>
            Loading teams...
          </Col>
        </Row>
      ) : (
        <>
          {awayTeam && (
            <TeamOddsRow
              teamIndex={props.gameData.awayTeamIndex}
              team={awayTeam}
              oppTeam={homeTeam}
              gameData={props.gameData}
              sportsbook={props.sportsbook}
              total="Over"
              past="true"
              market="h2h"
              score={props.gameData.awayScore}
              oppteamIndex={props.gameData.homeTeamIndex}
              betType={props.betType}
              bankroll={props.bankroll}
              valueBets={props.valueBets}
              todaysGames={props.todaysGames}
            />
          )}
          {homeTeam && (
            <TeamOddsRow
              teamIndex={props.gameData.homeTeamIndex}
              team={homeTeam}
              oppTeam={awayTeam}
              gameData={props.gameData}
              sportsbook={props.sportsbook}
              total="Under"
              past="true"
              market="h2h"
              score={props.gameData.homeScore}
              oppteamIndex={props.gameData.awayTeamIndex}
              betType={props.betType}
              bankroll={props.bankroll}
              valueBets={props.valueBets}
              todaysGames={props.todaysGames}
            />
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#303036',
    color: '#D4D2D5',
    fontSize: '14px',
    width: '22rem',
    borderRight: 'solid',
    borderLeft: 'solid',
    borderRadius: '.5em',
    marginTop: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    maxHeight: '8rem'
  },
  timeColumn: {
    textAlign: 'center',
    borderStyle: 'solid',
    borderTopStyle: 'none',
    borderLeftStyle: 'none',
    borderRadius: '.25em',
    padding: '.5rem',
    fontSize: '12px',
  },
  winPercentColumn: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    paddingTop: '0.5rem',
    padding: '0px',
  },
  loadingColumn: {
    textAlign: 'center',
    fontSize: '12px',
    padding: '1rem 0',
  },
};

export default PastGameCard;
