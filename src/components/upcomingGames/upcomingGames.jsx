import UpcomingBetterBets from './upcomingBetterBets/upcomingBetterBets.jsx';
import UpcomingGamesBySport from './upcomingGamesBySport/upcomingGamesBySport.jsx';
import LandingPageHero from '../landingPageHero/landingPageHero.jsx';
import Results from '../results/results.jsx'

const UpcomingGames = () => {
  document.title = 'Upcoming Games SQL TEST'

  return (
    <div className='bg-background w-full' style={{ width: '99.1vw' }}>
      <div >
        <div>
          <div>
            <LandingPageHero />
            <UpcomingBetterBets />
            <UpcomingGamesBySport />
            <Results />
          </div>

        </div>
      </div >
    </div >
  );
};

export default UpcomingGames;
