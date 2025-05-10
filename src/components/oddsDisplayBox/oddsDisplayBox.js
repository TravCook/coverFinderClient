import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck } from '../../utils/constants';

const OddsDisplayBox = ({ gameData, market, total, bestSportsbook, backgroundColor, homeAway }) => {

  const { sportsbook } = useSelector((state) => state.user);
  const { sports, pastGames } = useSelector((state) => state.games)

  const getColorForIndex = (index) => {
    let hue = (index / 45) * 120; // Scale from 0 to 120 degrees
    if(hue >= 0 && hue < 20){
      return `hsl(${hue}, 80%, 20%)`; // Full saturation and lightness at 50%
    }else if(hue > 20 && hue < 40){
      return `hsl(${hue}, 60%, 40%)`; // Full saturation and lightness at 50%
    }else if(hue > 40 && hue < 60){
      return `hsl(${hue}, 60%, 40%)`; // Full saturation and lightness at 50%
    }else if(hue > 60 && hue < 80){
      return `hsl(${hue}, 50%, 40%)`; // Full saturation and lightness at 50%
    }else if(hue > 80 && hue < 100){
      return `hsl(${hue}, 60%, 35%)`; // Full saturation and lightness at 50%
    }else if(hue > 100 && hue <= 120){
      return `hsl(${hue}, 70%, 30%)`; // Full saturation and lightness at 50%
    }
    
  };
  const [indexColor, setIndexColor] = useState(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex);

  useEffect(() => {
    setIndexColor(getColorForIndex(homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex)); // Update color when teamIndex changes
  }, [gameData]);

  const getOdds = () => {
    const bookmaker = gameData?.bookmakers?.find(b => bestSportsbook ? b.key === bestSportsbook : b.key === sportsbook);
    if (!bookmaker) return <></>;

    const marketData = bookmaker?.markets?.find(m => m.key === market);
    if (!marketData) return <></>;

    const outcome = marketData?.outcomes?.find(out => {
      if (homeAway) {
        return out.name === (homeAway === 'home' ? gameData.home_team : gameData.away_team) || out.name === total;
      } else {
        return out.name === (gameData.predictedWinner === 'home' ? gameData.home_team : gameData.away_team) || out.name === total;
      }

    });
    return outcome ? (outcome.price < 0 ? outcome.price : `+${outcome.price}`) : 'N/A';
  };
  return (
    <Col style={{
      border: ' .25em solid',
      backgroundColor: ` ${indexColor}`, 
      boxShadow: `${gameData.predictedWinner === homeAway && valueBetConditionCheck(sports, gameData, sportsbook, pastGames) ? `0px 0px 8px 4px rgba(230,196,27,0.75)` : ''}`, // Conditionally add outer shadow
      padding: 0
    }}>
      <Row style={{ margin: 0 }}>
        <Col style={{ padding: 0, textAlign: 'center', fontWeight: 'bold' }}>
          {getOdds()}
        </Col>
      </Row>
    </Col>
  );
};

export default OddsDisplayBox;
