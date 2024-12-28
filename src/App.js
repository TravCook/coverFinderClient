import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import PastGames from './components/pastGames/pastGames';
import moment from 'moment'

function App() {
  const [pageSelect, setPageSelect] = useState('Home');
  const [sportsBook, setSportsBook] = useState('fanduel');
  const [bankroll, setBankroll] = useState(10);
  const [games, setGames] = useState([]);
  const [pastGames, setpastGames] = useState([])
  const upcomingGamesGet = () => {
    fetch('http://localhost:3001/api/odds')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
      });
  };
      const pastGamesGet = () => {
        fetch('http://localhost:3001/api/odds/pastGameOdds', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            let sortedData = data.sort((a, b) => moment.utc(b.commence_time) - moment.utc(a.commence_time))
            setpastGames(sortedData)
        })
    }

  useEffect(() => {
    upcomingGamesGet();
    pastGamesGet()
  }, []);
  return (
    <div className="App">
      <NavBar 
        setBankroll={setBankroll} 
        sportsBook={sportsBook} 
        setSportsBook={setSportsBook} 
        pageSelect={pageSelect} 
        setPageSelect={setPageSelect} 
        games={games}
        pastGames={pastGames}
      />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={pageSelect === 'Home' ? 
              <UpcomingGames games={games} bankroll={bankroll} sportsBook={sportsBook} setPageSelect={setPageSelect} /> : 
              <SingleSportDisplay sportsBook={sportsBook} pageSelect={pageSelect} />} 
          />
          <Route path="/pastgames" element={<PastGames games={pastGames} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
