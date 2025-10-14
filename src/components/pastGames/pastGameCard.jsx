import { useState } from 'react';
import OddsDisplayBox from '../matchupCard/oddsDisplayBox/oddsDisplayBox.jsx';
import { getLuminance, hexToRgb } from "../../utils/constants"
import { useSelector } from 'react-redux';
const PastGameCard = ({ game, market }) => {
    let bgLum = getLuminance(hexToRgb('#2a2a2a')[0], hexToRgb('#2a2a2a')[1], hexToRgb('#2a2a2a')[2]);
    const { games, sports } = useSelector((state) => state.games);
    const [sport, setSport] = useState(sports.find(s => s.name === game.sport_key));
    return (
        <div className='flex flex-col border bg-primary m-2 w-full'>
            <div className="flex flex-row border-b">
                <div className="flex flex-row items-center" style={{ textAlign: 'center', width: '33%' }}>
                    <div><img style={{ maxWidth: '1.2rem' }} src={bgLum < .5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo} /></div>
                    <div className='flex-grow'>{game.awayTeamDetails.abbreviation}</div>
                </div>
                <div style={{ width: '33%', textAlign: 'center' }}>
                    {new Date(game.commence_time).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit'
                    })}
                </div>
                <div className="flex flex-row items-center" style={{ textAlign: 'center', width: '33%' }}>
                    <div className='flex-grow'>{game.homeTeamDetails.abbreviation}</div>
                    <div><img style={{ maxWidth: '1.2rem' }} src={bgLum < .5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo} /></div>
                </div>
            </div>
            {market === 'spreads' &&
                <div className="flex flex-row">
                    <div style={{ width: '50%' }} className="flex flex-row items-center border-r">
                        <div className="flex-grow"><OddsDisplayBox gameData={game} homeAway={'away'} market={'spreads'} /></div>
                        <div className="ml-auto w-[50%]" style={{ textAlign: 'center' }}>{game.awayScore}</div>
                    </div>
                    <div style={{ width: '50%' }} className="flex flex-row items-center border-l">
                        <div className="flex-grow" style={{ textAlign: 'center' }}>{game.homeScore}</div>
                        <div className="ml-auto"><OddsDisplayBox gameData={game} homeAway={'home'} market={'spreads'} /></div>
                    </div>
                </div>
            }
            {market === 'totals' &&
                <div className="flex flex-row">
                    <div style={{ width: '50%' }} className="flex flex-row items-center border-r">
                        <div className="flex-grow"><OddsDisplayBox gameData={game} homeAway={'away'} market={'totals'} total={'Under'} /></div>
                        <div className="ml-auto w-[50%]" style={{ textAlign: 'center' }}>{game.awayScore}</div>
                    </div>
                    <div style={{ width: '50%' }} className="flex flex-row items-center border-l">
                        <div className="flex-grow" style={{ textAlign: 'center' }}>{game.homeScore}</div>
                        <div className="ml-auto"><OddsDisplayBox gameData={game} homeAway={'home'} market={'totals'} total={'Over'} /></div>
                    </div>
                </div>
            }
            {!market && <div className="flex flex-row">
                <div style={{ width: '50%', backgroundColor: ((Math.round(game.predictedAwayScore - sport.hyperParams[0].scoreMAE) <= game.awayScore) && (Math.round(game.predictedAwayScore + sport.hyperParams[0].scoreMAE) >= game.awayScore)) ? 'green' : '' }} className="flex flex-row items-center border-r">
                    <div className="flex-grow"><OddsDisplayBox gameData={game} homeAway={'away'} market={'h2h'} /></div>
                    <div className="ml-auto w-[50%]" style={{ textAlign: 'center' }}>{game.awayScore}</div>
                </div>
                <div style={{ width: '50%', backgroundColor: ((Math.round(game.predictedHomeScore - sport.hyperParams[0].scoreMAE) <= game.homeScore) && (Math.round(game.predictedHomeScore + sport.hyperParams[0].scoreMAE) >= game.homeScore)) ? 'green' : '' }} className="flex flex-row items-center border-l">
                    <div className="flex-grow" style={{ textAlign: 'center' }}>{game.homeScore}</div>
                    <div className="ml-auto"><OddsDisplayBox gameData={game} homeAway={'home'} market={'h2h'} /></div>
                </div>
            </div>}
            <div className="flex flex-row">
                <div style={{ width: '50%', }} className="flex flex-row items-center border-r">
                    {/* <div className="flex-grow" style={{ textAlign: 'center' }}>{`${Math.round(game.predictedAwayScore - sport.hyperParams[0].scoreMAE)} - ${Math.round(game.predictedAwayScore + sport.hyperParams[0].scoreMAE)}`}</div> */}
                    <div className="flex-grow" style={{ textAlign: 'center', fontSize: '.75rem' }}>{`Pred: ${Math.round(game.predictedAwayScore)} ± ${Math.round(sport.hyperParams[0].scoreMAE)}`}</div>
                </div>
                <div style={{ width: '50%', }} className="flex flex-row items-center border-l">
                    {/* <div className="flex-grow" style={{ textAlign: 'center' }}>{`${Math.round(game.predictedHomeScore - sport.hyperParams[0].scoreMAE)} - ${Math.round(game.predictedHomeScore + sport.hyperParams[0].scoreMAE)}`}</div> */}
                    <div className="flex-grow" style={{ textAlign: 'center', fontSize: '.75rem' }}>{`Pred: ${Math.round(game.predictedHomeScore)} ± ${Math.round(sport.hyperParams[0].scoreMAE)}`}</div>
                </div>
            </div>
        </div>

    );
};

export default PastGameCard;