import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const OddsDisplayBox = ({ gameData, team, teamIndex, market, total }) => {
  // Predefined color range mapping for teamIndex
  const { sportsbook } = useSelector((state) => state.user);
  const getColorForIndex = (index) => {
    let hue = (index / 45) * 120; // Scale from 0 to 120 degrees
    return `hsl(${hue}, 100%, 50%)`; // Full saturation and lightness at 50%
  };

  const [indexColor, setIndexColor] = useState(getColorForIndex(teamIndex));

  useEffect(() => {
    setIndexColor(getColorForIndex(teamIndex)); // Update color when teamIndex changes
  }, [teamIndex]);

  const getOdds = () => {
    const bookmaker = gameData?.bookmakers?.find(b => b.key === sportsbook);
    if (!bookmaker) return <></>;
  
    const marketData = bookmaker?.markets?.find(m => m.key === market);
    if (!marketData) return <></>;
  
    const outcome = marketData?.outcomes?.find(out => {
      return out.name === team?.espnDisplayName || out.name === total;
    });
  
    return outcome ? (outcome.price < 0 ? outcome.price : `+${outcome.price}`) : 'N/A';
  };

  return (
    <Col style={{ borderStyle: 'solid',
     boxShadow: `inset 0 0 13px ${indexColor}`, 
     padding: 0 }}>
      <Row style={{ margin: 0 }}>
        <Col style={{ padding: 0, textAlign: 'center' }}>
          {getOdds()}
        </Col>
      </Row>
    </Col>
  );
};

export default OddsDisplayBox;
