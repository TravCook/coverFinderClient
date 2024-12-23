import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Fixed import for `react-router-dom`
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import PastGames from './components/pastGames/pastGames';

function App() {
  const [pageSelect, setPageSelect] = useState('Home');
  const [sportsBook, setSportsBook] = useState('fanduel');
  const [bankroll, setBankroll] = useState(10);

  return (
    <div className="App">
      <NavBar 
        setBankroll={setBankroll} 
        sportsBook={sportsBook} 
        setSportsBook={setSportsBook} 
        pageSelect={pageSelect} 
        setPageSelect={setPageSelect} 
      />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={pageSelect === 'Home' ? 
              <UpcomingGames bankroll={bankroll} sportsBook={sportsBook} setPageSelect={setPageSelect} /> : 
              <SingleSportDisplay sportsBook={sportsBook} pageSelect={pageSelect} />} 
          />
          <Route path="/pastgames" element={<PastGames />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
