// import { Row, Col, Container } from 'react-bootstrap';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox.jsx';
import { getLuminance, hexToRgb } from "../../../utils/constants"
const TeamOddsRow = ({ backgroundColor, gameData, total, homeAway }) => {
  let bgLum = getLuminance(hexToRgb('#545454')[0], hexToRgb('#545454')[1], hexToRgb('#545454')[2]);

  const renderTeamInfo = () => {
    return (
      <div style={{ color: bgLum < 0.5 ? '#ffffff' : '#000000', fontSize: '.75rem', letterSpacing: '.05rem' }}>
        {gameData && homeAway === 'home' 
          ? `${gameData.homeTeamDetails.abbreviation} ${gameData.homeTeamDetails.teamName}` 
          : `${gameData.awayTeamDetails.abbreviation} ${gameData.awayTeamDetails.teamName}`
        }
        {gameData.predictedWinner === homeAway && (
          <sup style={{
            marginLeft: '.2rem',
            fontSize: '.6rem',
            color: `hsl(${((homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)`
          }}>▲</sup>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center p-2 rounded-lg">
        {/* Left section: Logo + Team Info */}
        <div className="flex flex-row items-center">
          <img
            src={
              homeAway === 'home'
                ? (bgLum < 0.5 ? gameData.homeTeamDetails.lightLogo : gameData.homeTeamDetails.darkLogo)
                : (bgLum < 0.5 ? gameData.awayTeamDetails.lightLogo : gameData.awayTeamDetails.darkLogo)
            }
            style={{ width: '1.5rem', maxWidth: '30px', height: '1.5rem' }}
            alt='Team Logo'
          />
          {renderTeamInfo()}
        </div>

        {/* Right section: Score + Odds */}
        <div className="flex flex-row items-center gap-4">
          {(gameData.homeScore !==  null|| gameData.awayScore !== null) && (
            <div className="flex items-center justify-center text-center min-w-[2rem]">
              {homeAway === 'home' ? gameData.homeScore : gameData.awayScore}
            </div>
          )}
          <div>
            <OddsDisplayBox homeAway={homeAway} gameData={gameData} market='h2h' total={total} />
          </div>
        </div>
      </div>
    </div>
  );
};



export default TeamOddsRow;
