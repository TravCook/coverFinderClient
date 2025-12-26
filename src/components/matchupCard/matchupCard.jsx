import { useState, useMemo, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setStarredGames } from '../../redux/slices/userSlice.js';
import MatchupCardExtend from './matchupCardExtend/matchupCardExtend.jsx';
import { getColorForIndex, isSameDay } from '../../utils/constants';
import OddsDisplayBox from './oddsDisplayBox/oddsDisplayBox.jsx';
import { calculateProfitFromUSOdds, valueBetConditionCheck } from '../../utils/constants';

const MatchupCard = ({ gameData, final, starred, hover }) => {
  const dispatch = useDispatch();
  const { starredGames, sportsbook } = useSelector((state) => state.user);
  const sports = useSelector((state) => state.games.sports);

  const sport = useMemo(
    () => sports.find((s) => s.name === gameData.sport_key),
    [sports, gameData.sport_key]
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandSection, setExpandSection] = useState('Betting');

  const formattedTime = useMemo(() => {
    const gameTime = new Date(gameData.commence_time);
    const today = new Date();
    if (isSameDay(gameData.commence_time, today)) {
      return final
        ? 'Final'
        : gameTime.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
    }
    const weekday = gameTime.toLocaleString('en-US', { weekday: 'short' });
    return `${weekday} ${gameTime.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  }, [gameData.commence_time, final]);

  const handleStarClick = useCallback(() => {
    const isStarred = starredGames.some((game) => game.id === gameData.id);
    const updatedStarredGames = isStarred
      ? starredGames.filter((game) => game.id !== gameData.id)
      : [...starredGames, gameData];

    localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
    dispatch(setStarredGames(updatedStarredGames));
  }, [starredGames, gameData, dispatch]);

  const predictedFavorite =
    gameData.predictedWinner === 'home'
      ? gameData.homeTeam
      : gameData.awayTeam;

  // Example value metric: (model vs market deviation)
  const isValueBet = useMemo(() => {
    return (
      ((gameData.predictedWinner === 'home' && 'h2h') ||
        (gameData.predictedWinner === 'away' && 'h2h')) &&
      valueBetConditionCheck(
        sports,
        gameData,
        sportsbook,
        'h2h',
        gameData.predictedWinner
      )
    );
  }, [sports, gameData, sportsbook]);

  const outcome = useMemo(() => {
    const bookmaker = gameData?.bookmakers?.find((b) => b.key === sportsbook);
    const marketData = bookmaker?.markets?.find((m) => m.key === 'h2h');
    return marketData?.outcomes?.find((out) => {
      return (
        out.name ===
        (gameData.predictedWinner === 'home'
          ? gameData.homeTeamDetails.espnDisplayName
          : gameData.awayTeamDetails.espnDisplayName)
      );
    });
  }, [gameData, sportsbook]);

  return (
    <div
      className="p-3 bg-neutral-700 text-gray-100 rounded-lg shadow-md border border-gray-500 w-[25.5rem] transition-all duration-300 hover:shadow-lg"
    >
      {/* ------------------ TOP SECTION ------------------ */}
      <div className="flex items-center mb-2">
        <div className="text-sm text-gray-300 w-[35%]">{formattedTime}</div>
      </div>

      <div className="flex justify-between items-center">
        {/* Away */}
        <div className="flex flex-col items-center w-[40%]">

          <img
            src={gameData.awayTeamDetails.lightLogo}
            alt={gameData.awayTeam}
            className="w-10 h-10 object-contain"
          />
          <div className="w-20 h-2 bg-gray-200 rounded">
            <div
              className="h-2 rounded"
              style={{
                width: `${(gameData.awayTeamScaledIndex / 45) * 100}%`,
                backgroundColor: getColorForIndex(gameData.awayTeamScaledIndex),
              }}
            />
          </div>

          <div className="text-sm font-semibold">{gameData.awayTeamDetails.abbreviation} {gameData.awayTeamDetails.teamName}</div>
          <div>{`(${gameData.awayTeamDetails.currentStats['seasonWinLoss']})`}</div>

        </div>

        {/* Middle Info */}
        <div className='flex flex-col items-center justify-center'>
          {/* predicted score section */}
          <div className="mb-1 text-xs text-gray-300">Pred. Score</div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="text-lg font-bold">
              {gameData.predictedAwayScore ?? '-'}
            </div>
            <div>
              <span className="text-gray-400"> - </span>
            </div>
            <div className="text-lg font-bold">
              {gameData.predictedHomeScore ?? '-'}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div
              className={`text-xs px-2 py-1 rounded font-semibold flex justify-center items-center flex-col`}
            >
              {predictedFavorite === gameData.homeTeam ?
                <img
                  src={gameData.homeTeamDetails.lightLogo}
                  alt={gameData.homeTeam}
                  className="w-5 h-5 object-contain"
                /> : <img
                  src={gameData.awayTeamDetails.lightLogo}
                  alt={gameData.awayTeam}
                  className="w-5 h-5 object-contain"
                />}
              {predictedFavorite
                ? <span>{`Fav ${(gameData.predictionConfidence * 100).toFixed(1)}%`}</span>
                : 'Even Matchup'}
            </div>
          </div>

        </div>


        {/* Home */}
        <div className="flex flex-col items-center w-[40%]">
          <img
            src={gameData.homeTeamDetails.lightLogo}
            alt={gameData.homeTeam}
            className="w-10 h-10 object-contain"
          />
          <div className="w-20 h-2 bg-gray-200 rounded">
            <div
              className="h-2 rounded"
              style={{
                width: `${(gameData.homeTeamScaledIndex / 45) * 100}%`,
                backgroundColor: getColorForIndex(gameData.homeTeamScaledIndex),
              }}
            />
          </div>
          <div className="text-sm font-semibold">{gameData.homeTeamDetails.abbreviation} {gameData.homeTeamDetails.teamName}</div>
          <div>{`(${gameData.homeTeamDetails.currentStats['seasonWinLoss']})`}</div>
        </div>
      </div>

      {/* ------------------ MIDDLE SECTION ------------------ */}
      <div className="flex flex-col text-center text-xs mt-3 border-t border-gray-600 pt-2 h-25">

        {/* Header Row */}
        <div className="flex flex-row items-center mb-1 text-gray-400 font-bold text-xs">
          <div className="w-[10%]"></div> {/* empty space for logos */}
          <div className="w-[30%]">Moneyline</div>
          <div className="w-[30%] mr-2">Spread</div>
          <div className="w-[30%]">Total</div>
        </div>

        {/* Away Team Row */}
        <div className="flex flex-row items-center mb-1">
          <div className="w-[10%] flex justify-center items-center">
            <img
              src={gameData.awayTeamDetails.lightLogo}
              alt={gameData.awayTeam}
              className="object-contain p-1"
            />
          </div>
          <div className="w-[30%] h-[100%]">
            <OddsDisplayBox gameData={gameData} homeAway="away" market="h2h" />
          </div>
          <div className="w-[30%] h-[100%] mr-2">
            <OddsDisplayBox gameData={gameData} homeAway="away" market="spreads" />
          </div>
          <div className="w-[30%] h-[100%]">
            <OddsDisplayBox gameData={gameData} homeAway="away" market="totals" />
          </div>
        </div>

        {/* Home Team Row */}
        <div className="flex flex-row items-center">
          <div className="w-[10%] flex justify-center items-center">
            <img
              src={gameData.homeTeamDetails.lightLogo}
              alt={gameData.homeTeam}
              className="object-contain p-1"
            />
          </div>
          <div className="w-[30%] h-full">
            <OddsDisplayBox gameData={gameData} homeAway="home" market="h2h" />
          </div>
          <div className="w-[30%] h-[100%] mr-2">
            <OddsDisplayBox gameData={gameData} homeAway="home" market="spreads" />
          </div>
          <div className="w-[30%] h-[100%]">
            <OddsDisplayBox gameData={gameData} homeAway="home" market="totals" />
          </div>
        </div>

      </div>




      {/* ------------------ BOTTOM VALUE STRIP ------------------ */}
      {/* Value / Prediction Info */}



      {/* ------------------ EXPAND SECTION ------------------ */}
      {!hover &&
        <div className="mt-3">
          <button
            className="w-full bg-gray-600 text-gray-100 rounded py-1 text-sm hover:bg-gray-500"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded
              ? 'max-h-[1000px] opacity-100 mt-2'
              : 'max-h-0 opacity-0'
              }`}
          >
            <div className="flex justify-center gap-2 my-2">
              {['Stats', 'Betting', 'Recent'].map((section) => (
                <button
                  key={section}
                  className={`text-xs px-3 py-1 rounded border ${expandSection === section
                    ? 'bg-yellow-600 border-yellow-600 text-black'
                    : 'bg-gray-700 border-gray-500 text-gray-200'
                    }`}
                  onClick={() => setExpandSection(section)}
                >
                  {section}
                </button>
              ))}
            </div>
            <MatchupCardExtend expandSection={expandSection} gameData={gameData} />

            <Link
              to={`/matchup/${gameData.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-yellow-600 text-black w-full text-sm py-1 rounded">
                See Full Matchup
              </button>
            </Link>
          </div>
        </div>
      }
    </div>
  );
};

export default memo(MatchupCard);
