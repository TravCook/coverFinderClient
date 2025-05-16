import './App.css';
import { useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import { socket } from './socket';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import Results from './components/results/results';
import MatchupDetails from './components/matchupDetails/matchupDetails';
import { useDispatch, useSelector } from 'react-redux';
import { setOdds, setPastOddsEmit, setSports, } from './redux/odds/actions/oddsActions'
import { setTeams } from './redux/teams/actions/teamActions';
import { updateStarredGames, loadStarredGamesFromLocalStorage, removeStarredGames } from './redux/user/actions/userActions';

function App() {
  const dispatch = useDispatch()
  const { games, pastGames, sports } = useSelector((state) => state.games)
  const { starredGames, sportsbook } = useSelector((state) => state.user)



  useEffect(() => {
    dispatch(loadStarredGamesFromLocalStorage());
    fetch(`http://${process.env.REACT_APP_API_URL}/api/odds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sportsbook: sportsbook
      })
    }).then((res) => res.json()).then((data) => {
      dispatch(setSports(data.sports))
      dispatch(setOdds(data.odds))
    })
    function onGameUpdate(data) {
      dispatch(updateStarredGames(data))
      dispatch(setOdds(data));  // Update odds with the incoming data
    }
    function onPastGameUpdate(data) {
      dispatch(removeStarredGames(data));
      dispatch(setPastOddsEmit(data));  // Update past odds with the incoming data
    }
    function onTeamUpdate(data) {
      dispatch(setTeams(data))
    }
    socket.on('gameUpdate', onGameUpdate);
    socket.on('pastGameUpdate', onPastGameUpdate);
    socket.on('teamUpdate', onTeamUpdate)
    return () => {
      socket.off('gameUpdate', onGameUpdate);
      socket.off('pastGameUpdate', onPastGameUpdate);
      socket.off('teamUpdate', onTeamUpdate)
    };
  }, [dispatch, sportsbook]);

  useEffect(() => {
    if (starredGames) {
      localStorage.setItem('starredGames', JSON.stringify(starredGames));
    }
  }, [starredGames]); // This will run whenever `starredGames` changes

  return (
    <div className="App">
      { games && sports &&
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<UpcomingGames />} />
            <Route path="/sport/:league" element={<SingleSportDisplay />} />
            <Route path="/results" element={pastGames && <Results />} />
            <Route path="/matchup/:id" element={<MatchupDetails />} />
          </Routes>
        </BrowserRouter>

      }

    </div>
  );
}

export default App;
