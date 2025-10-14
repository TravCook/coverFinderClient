import { useState } from 'react';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox.jsx';
import { getLuminance, hexToRgb } from "../../../utils/constants"
import { useSelector } from 'react-redux';
const TeamOddsRow = ({ backgroundColor, gameData, total, homeAway }) => {
  let bgLum = getLuminance(hexToRgb('#545454')[0], hexToRgb('#545454')[1], hexToRgb('#545454')[2]);
  const { games, sports } = useSelector((state) => state.games);
  const [sport, setSport] = useState(sports.find(s => s.name === gameData.sport_key));
  const renderTeamInfo = () => {
    return (
      <div>
        <div style={{ color: bgLum < 0.5 ? '#ffffff' : '#000000', fontSize: '.80rem', letterSpacing: '.05rem' }}>
          {gameData && homeAway === 'home'
            ? gameData.homeTeamDetails.school ? `${gameData.homeTeamDetails.school}` : `${gameData.homeTeamDetails.abbreviation} ${gameData.homeTeamDetails.teamName}`
            : gameData.awayTeamDetails.school ? `${gameData.awayTeamDetails.school}` : `${gameData.awayTeamDetails.abbreviation} ${gameData.awayTeamDetails.teamName}`
          }
          {gameData.predictedWinner === homeAway && (
            <sup style={{
              marginLeft: '.2rem',
              fontSize: '.6rem',
              color: `hsl(${((homeAway === 'home' ? gameData.homeTeamScaledIndex : gameData.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)`
            }}>▲</sup>
          )}
        </div>
        {(gameData.probablePitcher && gameData.homeTeamDetails.pitcherStats[gameData.probablePitcher?.home?.id] && gameData.awayTeamDetails.pitcherStats[gameData.probablePitcher?.away?.id]) && (gameData.probablePitcher?.home && gameData.probablePitcher?.away  && gameData.homeTeamDetails.pitcherStats && gameData.awayTeamDetails.pitcherStats) && <div>{homeAway === 'home' ?
         `${gameData.probablePitcher?.home?.shortName} (${gameData.homeTeamDetails.pitcherStats[gameData.probablePitcher?.home?.id].BSBearnedRunAverage.toFixed(3).replace(/^0\./, '.')})` 
         :`${gameData.probablePitcher?.away?.shortName} (${gameData.awayTeamDetails.pitcherStats[gameData.probablePitcher?.away?.id].BSBearnedRunAverage.toFixed(3).replace(/^0\./, '.')})`}</div>}
      </div>

    );
  };
  return (
    <div>
      <div className={`flex flex-row flex-grow items-center py-2 border-${homeAway === 'home' ? 't' : 'b'}`}>
        {/* Left section: Logo + Team Info */}
        <div className="flex flex-row items-center gap-1">
          <img
            src={
              homeAway === 'home'
                ? (bgLum < 0.5 ? gameData.homeTeamDetails.lightLogo : gameData.homeTeamDetails.darkLogo)
                : (bgLum < 0.5 ? gameData.awayTeamDetails.lightLogo : gameData.awayTeamDetails.darkLogo)
            }
            style={{ width: '1.2rem', maxWidth: '30px', height: 'auto' }}
            alt='Team Logo'
          />
          {renderTeamInfo()}
        </div>
        {/* Right section: Score + Odds */}
        <div className="flex flex-row items-stretch gap-1 ml-auto" style={{ width: '60%' }}>
          {gameData.timeRemaining ? <div className="flex items-center justify-center text-center w-[30%]">
            {homeAway === 'home' ? gameData.homeScore : gameData.awayScore}
          </div> : <div className="flex items-center justify-center text-center w-[30%] border border-dashed">
            {/* {homeAway === 'home' ? `${Math.round(gameData.predictedHomeScore - sport.hyperParams[0].scoreMAE)} - ${Math.round(gameData.predictedHomeScore + sport.hyperParams[0].scoreMAE)}` : `${Math.round(gameData.predictedAwayScore - sport.hyperParams[0].scoreMAE)} - ${Math.round(gameData.predictedAwayScore + sport.hyperParams[0].scoreMAE)}`} */}
            {homeAway === 'home' ? `${Math.round(gameData.predictedHomeScore)}` : `${Math.round(gameData.predictedAwayScore)}`}
          </div>}

          <div className="flex flex-col w-[25%]">
            {/* {homeAway === 'away' && <div className="text-center">Money</div>} */}
            <div className="h-full">
              <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="h2h" />
            </div>
          </div>

          <div className="flex flex-col w-[25%]">
            {/* {homeAway === 'away' && <div className="text-center">Spread</div>} */}
            <div className="h-full">
              <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="spreads" />
            </div>
          </div>

          <div className="flex flex-col w-[25%]">
            {/* {homeAway === 'away' && <div className="text-center">Total</div>} */}
            <div className="h-full">
              <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="totals" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};



export default TeamOddsRow;
