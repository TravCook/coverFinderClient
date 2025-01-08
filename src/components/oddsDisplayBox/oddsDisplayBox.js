import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const OddsDisplayBox = ({ gameData, team, teamIndex, sportsbook, market, total }) => {
  // Predefined color range mapping for teamIndex
  const indexColors = [
    {
      key: 0,
      hexCode: "#f20707"
    },
    {
      key: 2,
      hexCode: "#f32b08"
    },
    {
      key: 3,
      hexCode: "#f33b09"
    },
    {
      key: 5,
      hexCode: "#f34e0a"
    },
    {
      key: 6,
      hexCode: "#f3600a"
    },
    {
      key: 8,
      "hexCode": "#f4750b"
    }, {
      key: 9,
      hexCode: "#f48a0b"
    },
    {
      key: 11,
      hexCode: "#f5a40c"
    },
    {
      key: 12,
      hexCode: "#f5be0d"
    },
    {
      key: 14,
      hexCode: "#f5d80e"
    },
    {
      key: 15,
      hexCode: "#f5f20e"
    },
    {
      key: 17,
      hexCode: "#f5df0e"
    },
    {
      key: 18,
      hexCode: "#f5cc0d"
    },
    {
      key: 20,
      hexCode: "#d2d50b"
    },
    {
      key: 21,
      hexCode: "#aede09"
    },
    {
      key: 23,
      hexCode: "#9ae308"
    },
    {
      key: 24,
      hexCode: "#77ec05"
    },
    {
      key: 26,
      hexCode: "#6bef04"
    },
    {
      key: 27,
      hexCode: "#59f403"
    },
    {
      key: 29,
      hexCode: "#47f802"
    },
    {
      key: 30,
      hexCode: "#2cff00"
    }
  ];


  const getColorForIndex = (index) => {
    let hue = (index / 45) * 120; // Scale from 0 to 120 degrees
    return `hsl(${hue}, 100%, 50%)`; // Full saturation and lightness at 50%
  };

  const [indexColor, setIndexColor] = useState(getColorForIndex(teamIndex));

  useEffect(() => {
    setIndexColor(getColorForIndex(teamIndex)); // Update color when teamIndex changes
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

    return outcome ? (outcome.price < 0 ? outcome.price : `+${outcome.price}`) : <></>;
  };

  return (
    <Col style={{ borderStyle: 'solid', boxShadow: `inset 0 0 13px ${indexColor}`, padding: 0 }}>
      <Row style={{ margin: 0 }}>
        <Col style={{ padding: 0, textAlign: 'center' }}>
          {getOdds()}
        </Col>
      </Row>
    </Col>
  );
};

export default OddsDisplayBox;
