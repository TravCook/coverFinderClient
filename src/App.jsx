import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
// import { socket } from './socket.jsx';
import NavBar from './components/navbar/navbar.jsx';
import UpcomingGames from './components/landingPage/upcomingGames/upcomingGames.jsx';
// import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay.jsx';
// import MatchupDetails from './components/matchupDetails/matchupDetails.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setGames, setSports, setMLModelWeights } from './redux/slices/oddsSlice.js';
import {setTeams} from './redux/slices/teamsSlice.js';
import LiveScoreListener from './components/liveScoreListener/liveScoreListener.jsx';
// import { setTeams } from './redux/teams/actions/teamActions';
// import LiveView from './components/live/liveView.jsx';
// import Rankings from './components/rankings/rankings.jsx';

function App() {
  const dispatch = useDispatch()
  const { games, pastGames, sports } = useSelector((state) => state.games)
  const { starredGames, sportsbook } = useSelector((state) => state.user)



  useEffect(() => {
    // dispatch(loadStarredGamesFromLocalStorage());
    fetch(`http://${import.meta.env.VITE_REACT_APP_API_URL}/api/odds`, {
      method: 'GET'
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify({
      //   sportsbook: sportsbook
      // })
    }).then((res) => res.json()).then((data) => {
      const cleanData = structuredClone(data); // safest if available
      dispatch(setTeams(cleanData.teams))
      dispatch(setSports(cleanData.sports))
      dispatch(setGames([...cleanData.odds, ...cleanData.pastGames]))
      dispatch(setMLModelWeights(cleanData.mlModelWeights))
    })

  }, [dispatch, sportsbook]);

  useEffect(() => {
    if (starredGames) {
      localStorage.setItem('starredGames', JSON.stringify(starredGames));
    }
  }, [starredGames]); // This will run whenever `starredGames` changes

  return (
    <div className="App bg-background text-text min-h-screen">
      {games && sports &&
        <BrowserRouter>
        <LiveScoreListener />
          <NavBar />
          <Routes>
            <Route path="/" element={<UpcomingGames />} />
            {/* <Route path="/sport/:league" element={<SingleSportDisplay />} />
            <Route path="/matchup/:id" element={<MatchupDetails />} />
            <Route path='/live' element={<LiveView />} />
            <Route path='/rankings' element={<Rankings />} /> */}
          </Routes>
        </BrowserRouter>

      }

    </div>
  );
}

export default App;
