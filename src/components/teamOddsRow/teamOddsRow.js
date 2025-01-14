import { Row, Col } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

const TeamOddsRow = ({ score, past, team, teamIndex, oppTeam, oppteamIndex, gameData, total, market, todaysGames, backgroundColor }) => {
  const { bankroll, betType, sportsbook } = useSelector((state) => state.user);
  const [profit, setProfit] = useState()
  // Extracting bookmakers data for clarity
  const bookmakerData = gameData.bookmakers.find(bookmaker => bookmaker.key === sportsbook);

  const calculateProfit = () => {
    const outcome = bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.find(outcome => {
      return outcome.name === team.espnDisplayName || outcome.name === total;
    });
  
    if (outcome) {
      let decimalOdds = calculateDecimalOdds(outcome.price);
      let betAmount;
  
      if (betType === 'Value' && outcome.impliedProb < gameData.winPercent) {
        // betAmount = bankroll ? (bankroll / valueBets.length) : 5;
      } else if (betType === 'Proportional') {
        betAmount = bankroll ? (bankroll / todaysGames.length) : 5;
      } else if (betType === 'Kelley') {
        betAmount = bankroll ? (calculateKellyCriterion(decimalOdds, outcome.impliedProb) * bankroll) : (calculateKellyCriterion(decimalOdds, outcome.impliedProb) * 5);
      }
  
      setProfit((betAmount * decimalOdds) - betAmount);
    }
  };
  useEffect(() => {
    calculateProfit()
  }, [betType, bankroll,])

  const renderKelleyBetDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map((outcome, index) => {
      const decimalOdds = calculateDecimalOdds(outcome.price);
      const kellyCriterion = calculateKellyCriterion(decimalOdds, outcome.impliedProb);
      const betAmount = bankroll ? calculateBetAmount(kellyCriterion, bankroll) : calculateBetAmount(kellyCriterion, 5);
      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total) {
        return teamIndex > oppteamIndex ? <span key={`${team.espnDisplayName}-kelley-${index}`}>{`$${betAmount.toFixed(2)}`}</span> :<span key={`${team.espnDisplayName}-kelley-${index}`}/>;
      }
      return <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
    });
  };

  // Conditionally render row based on whether it's a past or upcoming game
  // const renderBettorBetDisplay = () => {
  //   return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map((outcome, index) => {
  //     const betAmount = bankroll ? bankroll / valueBets.length : 5;
  //     // Determine if betAmount should be shown based on the team/total comparison
  //     if (outcome.name === team.espnDisplayName || outcome.name === total) {
  //       if (outcome.impliedProb < gameData.winPercent) {
  //         return teamIndex > oppteamIndex ? <span key={`${team.espnDisplayName}-bettor-${index}`}>{`$${betAmount.toFixed(2)}`}</span> : <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
  //       }
  //     }
  //     return <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
  //   });
  // };

  const renderProportionalBetDisplay = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map((outcome, index) => {
      const betAmount = bankroll ? (bankroll / todaysGames.length) : 5;
      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total) {
        return teamIndex > oppteamIndex || teamIndex === oppteamIndex ? <span key={`${team.espnDisplayName}-proportional-${index}`}>{`$${betAmount.toFixed(2)}`}</span> : <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
      }
      return <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
    });
  };
  // if(team?.teamName === 'Golden Hurricane'){
  //   console.log(gameData)
  //   console.log(`${team.teamName} index:${teamIndex}`)
  // }

  const renderTeamInfo = (past) => {
    return (
      <Col xs={4} style={{ alignContent: 'center', padding: 5 }}>
        {team ? `${team.abbreviation} ${team.teamName}` : <></>}
        <sup style={{ marginLeft: 5, fontSize: '.7rem' }}>{teamIndex || teamIndex === 0 ? (teamIndex).toFixed(2).padEnd(4, '0') : <></>}</sup>
      </Col>
    );
  };

  const renderProfit = () => {
    return bookmakerData?.markets.find(marketItem => marketItem.key === market)?.outcomes.map((outcome, index) => {

      // Determine if betAmount should be shown based on the team/total comparison
      if (outcome.name === team.espnDisplayName || outcome.name === total) {
        if (betType === 'Value') {
          if (outcome.impliedProb < gameData.winPercent) {
            return teamIndex > oppteamIndex ? `$${((profit)).toFixed(2)}` : <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
          }
        } else if (betType === 'Proportional' || betType === 'Kelley') {
          return teamIndex > oppteamIndex || teamIndex === oppteamIndex ? <span key={`${team.espnDisplayName}-profit-${index}`}>{`$${profit.toFixed(2)}`}</span> : <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
        }


      }
      return <span key={`${team.espnDisplayName}-kelley-${index}`}/>;
    });
  };
  return (
    <div>
      {
        teamIndex > oppteamIndex ?
          <Row style={{ alignItems: 'center', fontSize: '.7rem', paddingLeft: 5, paddingRight: 5, backgroundColor: backgroundColor, borderRadius: 5 }}>
            <Col style={{ padding: 0, textAlign: 'center' }} xs={1}>
              <img src={team.logo} style={{ width: '200%', maxWidth: '30px' }} alt='Team Logo' />
            </Col>
            {renderTeamInfo(past)}
            <Col xs={4} style={{ textAlign: 'center', padding: 5 }}>
              <Row style={{ textAlign: 'center', padding: 5 }}>
                <Col>
                  {score}
                </Col>
                <Col>
                  <OddsDisplayBox teamIndex={teamIndex} key={`${team?.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />
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
                  {betType === 'Value' ? <span key={`${team.espnDisplayName}-kelley-`}/> : betType === 'Kelley' ? renderKelleyBetDisplay() : betType === 'Proportional' ? renderProportionalBetDisplay() : 'N/A'}
                </Col>
                <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                  {profit ? renderProfit() : 'N/A'}
                </Col>
              </Row>
            </Col>
          </Row>
          :
          <Row style={{ alignItems: 'center', fontSize: '.7rem', paddingLeft: 5, paddingRight: 5 }}>
            <Col style={{ padding: 0, textAlign: 'center' }} xs={1}>
              <img src={team.logo} style={{ width: '200%', maxWidth: '30px' }} alt='Team Logo' />
            </Col>
            {renderTeamInfo(past)}
            <Col xs={4} style={{ textAlign: 'center', padding: 5 }}>
              <Row style={{ textAlign: 'center', padding: 5 }}>
                <Col>
                  {score}
                </Col>
                <Col>
                  <OddsDisplayBox teamIndex={teamIndex} key={`${team?.espnDisplayName} h2h`} team={team} oppTeam={oppTeam} gameData={gameData} sportsbook={sportsbook} market='h2h' total={total} />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                  <span> {betType && profit && teamIndex > oppteamIndex || teamIndex === oppteamIndex ? `Bet` : <></>} </span>
                </Col>
                <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                  <span>{betType && profit && teamIndex > oppteamIndex || teamIndex === oppteamIndex ? `Profit` : <></>}</span>
                </Col>
              </Row>
              <Row>
                <Col xs={6} style={{ alignContent: 'center', padding: 0, textAlign: 'center' }}>
                  {betType === 'Value' ? <span key={`${team.espnDisplayName}-kelley-`}/> : betType === 'Kelley' ? renderKelleyBetDisplay() : betType === 'Proportional' ? renderProportionalBetDisplay() : <></>}
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
