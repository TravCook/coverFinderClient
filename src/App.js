import './App.css';
import {useState, useEffect} from 'react';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';


function App() {
  const [pageSelect, setPageSelect] = useState('Home')
  const [sportsBook, setSportsBook] = useState('fanduel')


useEffect(()=> {
}, [])


  return (
    <div className="App">
      <NavBar sportsBook={sportsBook} setSportsBook={setSportsBook} pageSelect={pageSelect} setPageSelect={setPageSelect} />
      {pageSelect === 'Home' ? <UpcomingGames  sportsBook={sportsBook} />  : <SingleSportDisplay sportsBook={sportsBook} pageSelect={pageSelect}/> }
    </div>
  );
}

export default App;
