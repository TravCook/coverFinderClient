import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import { socket } from './socket';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import PastGames from './components/pastGames/pastGames';
import MatchupDetails from './components/matchupDetails/matchupDetails';
import moment from 'moment'

function App() {
  const [pageSelect, setPageSelect] = useState('Home');
  const [sportsBook, setSportsBook] = useState('fanduel');
  const [bankroll, setBankroll] = useState(10);
  const [games, setGames] = useState([]);
  const [pastGames, setpastGames] = useState([])
  const [betType, setbetType] = useState('Proportional')
  const [valueBets, setValueBets] = useState()
  const [todaysGames, setTodaysGames] = useState()
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);


  const upcomingGamesGet = () => {
    fetch('http://3.137.71.56:3001/api/odds')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
      });
  };
  const pastGamesGet = () => {
    fetch('http://3.137.71.56:3001/api/odds/pastGameOdds', {
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
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    function onGameUpdate(data) {
      setGames(data)
    }
    function onpastGameUpdate(data) {
      setpastGames(data)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('gameUpdate', onGameUpdate)
    socket.on('pastGameUpdate', onpastGameUpdate)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('gameUpdate', onGameUpdate)
      socket.off('pastGameUpdate', onpastGameUpdate)
    };
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
        setTodaysGames={setTodaysGames}
        setbetType={setbetType}
        setValueBets={setValueBets}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UpcomingGames valueBets={valueBets} todaysGames={todaysGames} betType={betType} games={games} bankroll={bankroll} sportsBook={sportsBook} setPageSelect={setPageSelect} />} />
          <Route path="/sport/:league" element={<SingleSportDisplay setPageSelect={setPageSelect} sportsBook={sportsBook} pageSelect={pageSelect} valueBets={valueBets} todaysGames={todaysGames} betType={betType} games={games} bankroll={bankroll} />} />
          <Route path="/pastgames" element={<PastGames valueBets={valueBets} todaysGames={todaysGames} betType={betType} bankroll={bankroll} sportsBook={sportsBook} setPageSelect={setPageSelect} games={pastGames} />} />
          <Route path="/matchup/:id" element={<MatchupDetails setPageSelect={setPageSelect} />} /> {/* Route for MatchupDetails */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
