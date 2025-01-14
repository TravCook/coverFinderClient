import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import { socket } from './socket';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import PastGames from './components/pastGames/pastGames';
import MatchupDetails from './components/matchupDetails/matchupDetails';
import { useDispatch } from 'react-redux';
import { setOdds, setPastOdds } from './redux/odds/actions/oddsActions'
import { setTeams } from './redux/teams/actions/teamActions';

function App() {  
  const dispatch = useDispatch()

  useEffect(() => {
    function onGameUpdate(data) {
      dispatch(setOdds(data))
    }
    function onPastGameUpdate(data) {
      dispatch(setPastOdds(data))
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
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<UpcomingGames />} />
          <Route path="/sport/:league" element={<SingleSportDisplay  />} />
          <Route path="/pastgames" element={<PastGames />} />
          <Route path="/matchup/:id" element={<MatchupDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
