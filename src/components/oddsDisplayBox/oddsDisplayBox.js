import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const OddsDisplayBox = ({ gameData, team, teamIndex, sportsbook, market, total }) => {
  // Predefined color range mapping for teamIndex
  const indexColors = [
    { key: -10, hexCode: '#f20707' },
    { key: -9, hexCode: '#f32b08' },
    { key: -8, hexCode: '#f33b09' },
    { key: -7, hexCode: '#f34e0a' },
    { key: -6, hexCode: '#f3600a' },
    { key: -5, hexCode: '#f4750b' },
    { key: -4, hexCode: '#f48a0b' },
    { key: -3, hexCode: '#f5a40c' },
    { key: -2, hexCode: '#f5be0d' },
    { key: -1, hexCode: '#f5d80e' },
    { key: 0, hexCode: '#f5f20e' },
    { key: 1, hexCode: '#f5df0e' },
    { key: 2, hexCode: '#f5cc0d' },
    { key: 3, hexCode: '#d2d50b' },
    { key: 4, hexCode: '#aede09' },
    { key: 5, hexCode: '#9ae308' },
    { key: 6, hexCode: '#77ec05' },
    { key: 7, hexCode: '#6bef04' },
    { key: 8, hexCode: '#59f403' },
    { key: 9, hexCode: '#47f802' },
    { key: 10, hexCode: '#2cff00' },
  ];

  // Function to get color based on the team index
  const getColor = (index) => {
    return indexColors.find(color => index <= color.key)?.hexCode || '#f20707';
  };

  const [indexColor, setIndexColor] = useState(getColor(teamIndex));

  useEffect(() => {
    setIndexColor(getColor(teamIndex)); // Update color when teamIndex changes
  }, [teamIndex]);

  const getOdds = () => {
    const bookmaker = gameData.bookmakers.find(b => b.key === sportsbook);
    if (!bookmaker) return null;

    const marketData = bookmaker.markets.find(m => m.key === market);
    if (!marketData) return null;

    const outcome = marketData.outcomes.find(out => {
      const outcomeSplit = out.name.split(" ");
      const espnNameSplit = team.espnDisplayName.split(" ");
      return out.name === team.espnDisplayName || out.name === total || outcomeSplit[outcomeSplit.length - 1] === espnNameSplit[espnNameSplit.length - 1];
    });

    return outcome ? (outcome.price < 0 ? outcome.price : `+${outcome.price}`) : null;
  };

  return (
    <Col xs={12} style={{ borderStyle: 'solid', boxShadow: `inset 0 0 10px ${indexColor}` }}>
      <Row style={{margin: 0}}>
        <Col style={{ padding: 0, textAlign: 'center' }}>
          {getOdds()}
        </Col>
      </Row>
    </Col>
  );
};

export default OddsDisplayBox;
