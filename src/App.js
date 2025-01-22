import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import { socket } from './socket';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import PastGames from './components/pastGames/pastGames';
import MatchupDetails from './components/matchupDetails/matchupDetails';
import { useDispatch, useSelector } from 'react-redux';
import { setOdds, setPastOdds } from './redux/odds/actions/oddsActions'
import { setTeams } from './redux/teams/actions/teamActions';
import { setStarredGames } from './redux/user/actions/userActions';

function App() {  
  const dispatch = useDispatch()
  const { teams } = useSelector((state) => state.teams)
  const { games, pastGames } = useSelector((state) => state.games)
  const { starredGames } = useSelector((state) => state.user)


  useEffect(() => {
    const starredGamesCookie = localStorage.getItem('starredGames') || '[]';
    
    if (starredGamesCookie) {
      // Parse the cookie string into an array and dispatch to Redux
      dispatch(setStarredGames(JSON.parse(starredGamesCookie)));
    }
    fetch(`http://${process.env.REACT_APP_API_URL}/api/odds`).then((res) => res.json()).then((data)=> {
      dispatch(setOdds(data.odds))
      dispatch(setPastOdds(data.pastGameOdds))
      dispatch(setTeams(data.teams))
    })
    function onGameUpdate(data) {
      data.map((updatedGame)=> {
        const isStarred = starredGames.some((game) => game.id === updatedGame.id);
        if (isStarred) {
          // Update the starred game with the new game data (including live scores)
          const updatedStarredGames = starredGames.map((game) =>
            game.id === updatedGame.id ? { ...game, ...updatedGame } : game
          );
          localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
  
          // Dispatch updated starred games
          dispatch(setStarredGames(updatedStarredGames));
        }
      })

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
      {teams && games && pastGames ?
             <BrowserRouter>
             <NavBar />
             <Routes>
               <Route path="/" element={<UpcomingGames />} />
               <Route path="/sport/:league" element={<SingleSportDisplay  />} />
               <Route path="/pastgames" element={<PastGames />} />
               <Route path="/matchup/:id" element={<MatchupDetails />} />
             </Routes>
           </BrowserRouter>
       
       : <></>}

    </div>
  );
}

export default App;
