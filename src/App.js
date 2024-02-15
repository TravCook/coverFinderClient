import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';


function App() {

  const [sportsBook, setSportsBook] = useState('fanduel')


  return (
    <div className="App">
      <NavBar sportsBook={sportsBook} setSportsBook={setSportsBook} />
      <UpcomingGames  sportsBook={sportsBook} />
    </div>
  );
}

export default App;
