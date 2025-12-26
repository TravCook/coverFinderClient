import UpcomingBetterBets from './upcomingBetterBets/upcomingBetterBets.jsx';
import UpcomingGamesBySport from './upcomingGamesBySport/upcomingGamesBySport.jsx';
// import LandingPageHero from '../landingPageHero/landingPageHero.jsx';
// import Results from '../../results/results.jsx'
import LandingPageLive from '../landingPageLive/landingPageLive.jsx';
// import { useSelector } from 'react-redux';
// import LandingPageConfidence from '../landingPageConfidence/landingPageConfidence.jsx';
// import { getDifferenceInMinutes, isSameDay } from '../../../utils/constants.js';
// import TodaysGames from './todaysGames/todaysGames.jsx';
import PastGamesDisplay from '../../pastGames/pastGames.jsx';
import BackTestingDisplay from '../../backTestingDisplay/backTestingDisplay.jsx';
import EvTestingDisplay from '../../evTestingDisplay/evTestingDisplay.jsx';

const UpcomingGames = () => {
  // const { games } = useSelector((state) => state.games);
  return (
    <div className='bg-background'>
      <title>BETTER BETS LOCAL DB</title>

      <section className='py-10 flex flex-col items-center'>
        <div className='flex flex-row gap-2' style={{ width: '97%' }}>
          <UpcomingBetterBets />
        </div>
      </section>

      <section className='py-10 flex flex-col items-center'>
        <div className='flex flex-row gap-2' style={{ width: '97%' }}>
          <LandingPageLive />
        </div>
      </section>

      {/* todays games */}
      
        {/* <section className='py-10 flex flex-col items-center'>
          <UpcomingGamesBySport />
        </section> */}

      {/* results */}
      <section className='py-10 flex flex-col items-center'>
        <div className='flex flex-row gap-2' style={{ width: '97%' }}>
          <PastGamesDisplay />
        </div>
      </section>

      {/* <section className='py-10 flex flex-col items-center'>
        <div className='flex flex-row gap-2' style={{ width: '97%' }}>
          <BackTestingDisplay />
        </div>
      </section> */}

      {/* <section>
        <div className='flex flex-row gap-2' style={{ width: '97%' }}>
          <EvTestingDisplay />
        </div>
      </section> */}


    </div>
  );

};

export default UpcomingGames;
