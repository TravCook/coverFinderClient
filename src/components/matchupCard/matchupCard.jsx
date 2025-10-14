import { useState, useRef, useEffect } from 'react';
import TeamOddsRow from './teamOddsRow/teamOddsRow.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Filled star
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // Outlined s
import { Link } from 'react-router';
import { isSameDay } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setStarredGames } from '../../redux/slices/userSlice.js'; // Adjust the import path as necessary
import MatchupCardExtend from './matchupCardExtend/matchupCardExtend.jsx';

const MatchupCard = ({ gameData, final, starred }) => {
  const dispatch = useDispatch()
  const { starredGames } = useSelector((state) => state.user)
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandSection, setExpandSection] = useState('Betting')
  const { sportsbook } = useSelector((state) => state.user);


  const handleStarClick = (event) => {
    // Check if the game is already starred
    if (!starredGames.some((game) => game.id === gameData.id)) {
      // If not, create a new array with the new starred game
      const updatedStarredGames = [...starredGames, gameData];

      // Save the updated starred games to cookies
      localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));

      dispatch(setStarredGames(updatedStarredGames)); // Dispatch the updated array

    } else {
      // If already starred, filter out the game and update the state
      const updatedStarredGames = starredGames.filter((game) => game.id !== gameData.id);
      localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
      dispatch(setStarredGames(updatedStarredGames)); // Dispatch the filtered array
    }
  };

  const formatGameTime = () => {
    const gameTime = new Date(gameData.commence_time);
    return isSameDay(gameData.commence_time, new Date())
      ? final ? `Final` : gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : final ? `${gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit' })} Final` : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
  };
console.log(gameData)
  let backgroundColor
  if (final) {
    backgroundColor = gameData?.predictionCorrect ? 'rgba(6, 64, 43, .7)' : 'rgba(77, 0, 0, .7)';
  }
  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };
  return (
    <div className='p-1' style={{
      backgroundColor: '#545454',
      color: '#D4D2D5',
      fontSize: '.8rem',
      borderRadius: '.5em',
      margin: '.3rem auto',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      border: '.1em solid #858585',
      width: '25.5rem'
    }} >
      <div className='flex flex-row'>
        <div className='flex items-center justify-center' style={{ width: '45%', fontSize: '1rem' }}>
          {gameData.timeRemaining ? gameData.timeRemaining : formatGameTime()}
        </div>
        <div className="flex flex-col items-stretch gap-1" style={{ width: '55%' }}>
          <div className='ml-auto'>
            {!final ?
              <div >
                <button
                  id={gameData.id}
                  onClick={handleStarClick}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: '.2rem', alignItems: 'center', display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                >
                  {starredGames.some((game) => game.id === gameData.id) ? (
                    <FontAwesomeIcon icon={faStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
                  ) : (
                    <FontAwesomeIcon icon={farStar} style={{ color: 'gold', fontSize: '1.0rem' }} />
                  )}
                </button>
              </div>
              :
              <></>}
          </div>
          <div className='flex flex-row items-streth gap-1'>
            <div style={{ width: '30%', textAlign: 'center' }}>{!gameData.timeRemaining ? 'Proj.' : 'Score'} </div> {/* Placeholder for the score column */}
            <div style={{ width: '25%', textAlign: 'center' }}>Money</div>
            <div style={{ width: '25%', textAlign: 'center' }}>Spread</div>
            <div style={{ width: '25%', textAlign: 'center' }}>Total</div>
          </div>
        </div>
      </div>


      {
        <div>
          <TeamOddsRow
            teamIndex={gameData.awayTeamIndex}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.awayScore}
            oppteamIndex={gameData.homeTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
            predictedWinner={gameData.predictedWinner === 'away' ? true : false}
            homeAway={'away'}
            final={final}
          />
          <TeamOddsRow
            teamIndex={gameData.homeTeamIndex}
            gameData={gameData}
            sportsbook={sportsbook}
            score={gameData.homeScore}
            oppteamIndex={gameData.awayTeamIndex}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            backgroundColor={backgroundColor}
            predictedWinner={gameData.predictedWinner === 'home' ? true : false}
            homeAway={'home'}
            final={final}
          />
        </div>
      }
      {(!final && !starred) &&
        <div>
            <button className='hover:bg-commonButton hover:text-black bg-secondary rounded py-1 w-full transition-all duration-200 ease-in-out' style={{ fontSize: '.8rem' }} onClick={handleToggle}>
              {isExpanded ? 'Collapse' : 'Details'}
            </button>
        </div>
      }
      {(
        <div
          className={`
          transition-all duration-600 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-[1000px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="flex flex-row justify-between my-2 mx-2">
            <button className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton" onClick={() => setExpandSection('Stats')}>Stats</button>
            <button className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton" onClick={() => setExpandSection('Betting')}>Betting</button>
            <button className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton" onClick={() => setExpandSection('Recent')}>Recent</button>
          </div>

          <MatchupCardExtend expandSection={expandSection} gameData={gameData} />

          <Link to={`/matchup/${gameData.id}`} target='_blank' rel="noopener noreferrer">
            <button className="bg-yellow-600 border-yellow-600 text-black w-full text-sm py-1">
              See Full Matchup
            </button>
          </Link>
        </div>

      )}

    </div>
  );
};

export default MatchupCard;
