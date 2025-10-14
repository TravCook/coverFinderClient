import UpcomingBetterBets from './upcomingBetterBets/upcomingBetterBets.jsx';
import UpcomingGamesBySport from './upcomingGamesBySport/upcomingGamesBySport.jsx';
import LandingPageHero from '../landingPageHero/landingPageHero.jsx';
import Results from '../../results/results.jsx'
import LandingPageLive from '../landingPageLive/landingPageLive.jsx';
import { useSelector } from 'react-redux';
import LandingPageConfidence from '../landingPageConfidence/landingPageConfidence.jsx';

const UpcomingGames = () => {
  const { games } = useSelector((state) => state.games);
return (
  <div className='bg-background'>
    <title>BETTER BETS</title>

    <section className='py-10 flex justify-center'>
      <LandingPageHero />
    </section>

    <section className='py-10 flex flex-col items-center'>
      <div className='flex flex-row gap-2' style={{width: '97%'}}>
        <UpcomingBetterBets />
        <LandingPageConfidence />
      </div>
    </section>

    {games.filter(game => game.timeRemaining).length > 0 && (
      <section className='py-10 flex flex-col items-center'>
        <LandingPageLive />
      </section>
    )}

    <section className='py-10 flex flex-col items-center'>
      <UpcomingGamesBySport />
    </section>

    <section className='py-10 flex flex-col items-center'>
      <Results />
    </section>
  </div>
);

};

export default UpcomingGames;
