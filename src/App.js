import './App.css';
import {useState, useEffect} from 'react';
import NavBar from './components/navbar/navbar';
import UpcomingGames from './components/upcomingGames/upcomingGames';
import SingleSportDisplay from './components/singleSportDisplay/singleSportDisplay';
import {BrowserRouter, Routes, Route} from 'react-router'
import PastGames from './components/pastGames/pastGames'


function App() {
  const [pageSelect, setPageSelect] = useState('Home')
  const [sportsBook, setSportsBook] = useState('fanduel')


useEffect(()=> {
}, [])


  return (
    <div className="App">
      <NavBar sportsBook={sportsBook} setSportsBook={setSportsBook} pageSelect={pageSelect} setPageSelect={setPageSelect} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={pageSelect === 'Home' ? <UpcomingGames  sportsBook={sportsBook} setPageSelect={setPageSelect}/>  : <SingleSportDisplay sportsBook={sportsBook} pageSelect={pageSelect}/>} />
          <Route path='/pastgames' element={<PastGames />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
