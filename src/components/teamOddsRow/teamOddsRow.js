import { Row, Col } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';

// Function to calculate decimal odds from moneyline odds
const calculateDecimalOdds = (moneylineOdds) => {
  return moneylineOdds > 0 ? (moneylineOdds / 100) + 1 : (100 / -moneylineOdds) + 1;
};

// Function to calculate the Kelley Criterion for bet sizing
const calculateKellyCriterion = (decimalOdds, impliedProb) => {
  return (decimalOdds * impliedProb - (1 - impliedProb)) / (decimalOdds - 1);
};


// Function to calculate the amount to bet
const calculateBetAmount = (kellyCriterion, bankroll) => {
  return `$${((kellyCriterion * bankroll)).toFixed(2)}`; // 0.25 multiplier for bet sizing
};

const TeamOddsRow = ({ score, past, team, teamIndex, oppTeam, oppteamIndex, gameData, sportsbook, total, market, bankroll}) => {
  // Extracting bookmakers data for clarity
  const bookmakerData = gameData.bookmakers.find(bookmaker => bookmaker.key === sportsbook);

  // Conditionally render row based on whether it's a past or upcoming game
  const renderOddsDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      const decimalOdds = calculateDecimalOdds(outcome.price);
      const kellyCriterion = calculateKellyCriterion(decimalOdds, outcome.impliedProb);
      const betAmount = calculateBetAmount(kellyCriterion, bankroll);

      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        return teamIndex > oppteamIndex ? betAmount : null;
      }
      return null;
    });
  };

  const renderTeamInfo = () => {
    return (
      <Col xs={7} style={{ alignContent: 'center' }}>
        {team ? `${team.abbreviation} ${team.teamName}` : null}
        <sup style={{ marginLeft: 5 }}>{(teamIndex * 10).toFixed(2).padEnd(4, '0')}</sup>
      </Col>
    );
  };

  return (
    <Row style={{ marginTop: 5, alignItems: 'center', fontSize: '12px' }}>
      <Col xs={1}>
        <img src={team.logo} style={{ width: '20px' }} alt='Team Logo' />
      </Col>
      {renderTeamInfo()}
      <Col xs={2} style={{ textAlign: 'center', padding: 5 }}>
        {past ? `${score}` : <OddsDisplayBox teamIndex={teamIndex} key={`${team.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />}
      </Col>
      {!past && (
        <Col xs={1} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
          {renderOddsDisplay()}
        </Col>
      )}
    </Row>
  );
};

export default TeamOddsRow;
