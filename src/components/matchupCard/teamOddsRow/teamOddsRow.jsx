import { useState } from 'react';
import OddsDisplayBox from '../oddsDisplayBox/oddsDisplayBox.jsx';
import { getLuminance, hexToRgb } from "../../../utils/constants";
import { useSelector } from 'react-redux';

const TeamOddsRow = ({ backgroundColor, gameData, total, homeAway }) => {
  const { games, sports } = useSelector((state) => state.games);
  const [sport] = useState(sports.find(s => s.name === gameData.sport_key));
  const bgLum = getLuminance(...hexToRgb('#545454'));

  const teamDetails = homeAway === 'home' ? gameData.homeTeamDetails : gameData.awayTeamDetails;
  const teamName = teamDetails.school
    ? teamDetails.school
    : `${teamDetails.abbreviation} ${teamDetails.teamName}`;
  const logoSrc = bgLum < 0.5 ? teamDetails.lightLogo : teamDetails.darkLogo;

  const isPitcherAvailable =
    gameData.probablePitcher &&
    teamDetails.pitcherStats &&
    teamDetails.pitcherStats[gameData.probablePitcher?.[homeAway]?.id];

  const pitcherInfo = isPitcherAvailable
    ? `${gameData.probablePitcher?.[homeAway]?.shortName} (${
        teamDetails.pitcherStats[gameData.probablePitcher?.[homeAway]?.id].BSBearnedRunAverage
          .toFixed(3)
          .replace(/^0\./, '.')
      })`
    : null;

  const predictedScore =
    homeAway === 'home'
      ? Math.round(gameData.predictedHomeScore)
      : Math.round(gameData.predictedAwayScore);

  return (
    <div>
      <div
        className={`flex flex-row flex-grow items-center py-2 border-${homeAway === 'home' ? 't' : 'b'}`}
        style={{ gap: '1.5rem' }}
      >
        {/* Left section: Logo + Team Info */}
        <div className="flex flex-row items-center min-w-0 w-[45%] gap-2">
          <img
            src={logoSrc}
            style={{ width: '2rem', maxWidth: '32px', height: 'auto' }}
            alt="Team Logo"
          />
          <div className="flex flex-col min-w-0">
            <div
              style={{
                color: bgLum < 0.5 ? '#fff' : '#000',
                fontSize: '.85rem',
                letterSpacing: '.05rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {teamName}
              {gameData.predictedWinner === homeAway && (
                <sup
                  style={{
                    marginLeft: '.2rem',
                    fontSize: '.6rem',
                    color: `hsl(${
                      ((homeAway === 'home'
                        ? gameData.homeTeamScaledIndex
                        : gameData.awayTeamScaledIndex) /
                        45) *
                      120
                    }, 100%, 50%)`,
                  }}
                >
                  ▲
                </sup>
              )}
            </div>
            {pitcherInfo && (
              <div style={{ fontSize: '.75rem', color: '#888' }}>{pitcherInfo}</div>
            )}
          </div>
        </div>

        {/* Right section: Score + Odds */}
        <div className="flex flex-row items-stretch flex-grow">
          <div className="flex items-center justify-center text-center w-[22%]">
            {gameData.timeRemaining
              ? homeAway === 'home'
                ? gameData.homeScore
                : gameData.awayScore
              : (
                <div className="border border-dashed rounded px-2 py-1 w-[75%] h-full flex items-center justify-center text-[.9rem]">
                  {predictedScore}
                </div>
              )}
          </div>

          <div className="flex flex-col w-[26%]">
            <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="h2h" />
          </div>
          <div className="flex flex-col w-[26%]">
            <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="spreads" />
          </div>
          <div className="flex flex-col w-[26%]">
            <OddsDisplayBox homeAway={homeAway} gameData={gameData} market="totals" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOddsRow;
