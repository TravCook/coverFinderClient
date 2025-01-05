import { Row, Col } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';
import { useEffect, useState } from 'react';

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

const TeamOddsRow = ({ score, past, team, teamIndex, oppTeam, oppteamIndex, gameData, sportsbook, total, market, bankroll, betType, valueBets, todaysGames }) => {
  const [profit, setProfit] = useState()
  // Extracting bookmakers data for clarity
  const bookmakerData = gameData.bookmakers.find(bookmaker => bookmaker.key === sportsbook);

  const calculateProfit = () => {
    bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      let decimalOdds
      let betAmount
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        decimalOdds = (calculateDecimalOdds(outcome.price))
        if (betType === 'Value' && outcome.impliedProb < gameData.winPercent) {
          betAmount = (bankroll / valueBets.length);
        } else if (betType === 'Proportional') {
          betAmount = (bankroll / todaysGames.length)
        } else if (betType === 'Kelley') {
          betAmount = (calculateKellyCriterion(decimalOdds, outcome.impliedProb) * bankroll)
        }
        setProfit((betAmount * decimalOdds) - betAmount)
      }
    })


  }
  useEffect(() => {
    calculateProfit()
  }, [betType, bankroll, valueBets, valueBets])

  const renderKelleyBetDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      const decimalOdds = calculateDecimalOdds(outcome.price);
      const kellyCriterion = calculateKellyCriterion(decimalOdds, outcome.impliedProb);
      const betAmount = calculateBetAmount(kellyCriterion, bankroll);
      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        return teamIndex > oppteamIndex ? betAmount : <></>;
      }
      return <></>;
    });
  };

  // Conditionally render row based on whether it's a past or upcoming game
  const renderBettorBetDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      const betAmount = bankroll / valueBets.length;

      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        if (outcome.impliedProb < gameData.winPercent) {
          return teamIndex > oppteamIndex ? `$${((betAmount)).toFixed(2)}` : <></>;
        }
      }
      return <></>;
    });
  };

  const renderProportionalBetDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ")
      const betAmount = bankroll / todaysGames.length;

      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        return teamIndex > oppteamIndex ? `$${((betAmount)).toFixed(2)}` : <></>;
      }
      return <></>;
    });
  };

  const renderTeamInfo = (past) => {
    if(past){
      return (
        <Col xs={4} style={{ alignContent: 'center' }}>
          {team ? `${team.abbreviation} ${team.teamName}` : null}
          <sup style={{ marginLeft: 5 }}>{(teamIndex).toFixed(2).padEnd(4, '0')}</sup>
        </Col>
      );
    }else{
      return (
        <Col xs={6} style={{ alignContent: 'center' }}>
          {team ? `${team.abbreviation} ${team.teamName}` : null}
          <sup style={{ marginLeft: 5 }}>{(teamIndex).toFixed(2).padEnd(4, '0')}</sup>
        </Col>
      );
    }

  };

  const renderProfit = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map(outcome => {
      const outcomeSplit = outcome.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1]) {
        if (betType === 'Value') {
          if (outcome.impliedProb < gameData.winPercent) {
            return teamIndex > oppteamIndex ? `$${((profit)).toFixed(2)}` : <></>;
          }
        } else if (betType === 'Proportional' || betType === 'Kelley') {
          return teamIndex > oppteamIndex ? `$${((profit)).toFixed(2)}` : <></>;
        }


      }
      return <></>;
    });
  };
  return (
    <div>
      {past ?
        <Row style={{ marginTop: 5, alignItems: 'center', fontSize: '12px' }}>
          <Col xs={1}>
            <img src={team.logo} style={{ width: '20px' }} alt='Team Logo' />
          </Col>
          {renderTeamInfo(past)}
          <Col xs={4} style={{ textAlign: 'center', padding: 5 }}>
          <Row>
            <Col>
            {score}
            </Col>
            <Col>
            <OddsDisplayBox teamIndex={teamIndex} key={`${team.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />
            </Col>
          </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                <span> {betType && profit && teamIndex > oppteamIndex ? `Bet` : <></>} </span>
              </Col>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                <span>{betType && profit && teamIndex > oppteamIndex ? `Profit` : <></>}</span>
              </Col>
            </Row>
            <Row>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                {betType === 'Value' ? renderBettorBetDisplay() : betType === 'Kelley' ? renderKelleyBetDisplay() : betType === 'Proportional' ? renderProportionalBetDisplay() : <></>}
              </Col>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                {profit ? renderProfit() : <></>}
              </Col>
            </Row>
          </Col>
        </Row> :
        <Row style={{ marginTop: 5, alignItems: 'center', fontSize: '12px' }}>
          <Col xs={1}>
            <img src={team.logo} style={{ width: '20px' }} alt='Team Logo' />
          </Col>
          {renderTeamInfo()}
          <Col xs={2} style={{ textAlign: 'center', padding: 5 }}>
            {past ? `${score}` : <OddsDisplayBox teamIndex={teamIndex} key={`${team.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />}
          </Col>
          <Col>
            <Row>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                <span> {betType && profit && teamIndex > oppteamIndex ? `Bet` : <></>} </span>
              </Col>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                <span>{betType && profit && teamIndex > oppteamIndex ? `Profit` : <></>}</span>
              </Col>
            </Row>
            <Row>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                {betType === 'Value' ? renderBettorBetDisplay() : betType === 'Kelley' ? renderKelleyBetDisplay() : betType === 'Proportional' ? renderProportionalBetDisplay() : <></>}
              </Col>
              <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                {profit ? renderProfit() : <></>}
              </Col>
            </Row>
          </Col>
        </Row>
      }
    </div>

  );
};

export default TeamOddsRow;
