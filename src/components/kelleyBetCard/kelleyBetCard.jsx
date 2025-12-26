import {useMemo} from 'react';
import { isSameDay } from '../../utils/constants';

const KelleyBetCard = ({ game }) => {
    const formattedTime = useMemo(() => {
        const gameTime = new Date(game.commence_time);
        const today = new Date();
        if (isSameDay(game.commence_time, today)) {
            return gameTime.toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
        }
        const weekday = gameTime.toLocaleString('en-US', { weekday: 'short' });
        return `${weekday} ${gameTime.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })}`;
    }, [game.commence_time]);
    return (
        <div className='w-[12em] min-w-[13em]'>
            <div
                key={game.id}
                className='bg-zinc-800 rounded-lg p-3 flex flex-col gap-2 border border-zinc-600 hover:border-yellow-500 transition-all'
            >
                <div className='text-xs text-gray-300'>
                    {formattedTime}
                </div>
                {/* Teams */}
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <img className='w-5 h-5 rounded-full' src={game.predictedWinner === 'home' ? game.homeTeamDetails.lightLogo : game.awayTeamDetails.lightLogo} alt={game.predictedWinner === 'home' ? game.homeTeamDetails.abbreviation : game.awayTeamDetails.abbreviation} />
                        <span className='font-semibold text-white'>{game.predictedWinner === 'home' ? game.homeTeamDetails.abbreviation : game.awayTeamDetails.abbreviation}</span>
                    </div>
                    <div className='text-gray-400 font-medium'>→</div>
                    <div className='flex items-center gap-1'>
                        <img className='w-5 h-5 rounded-full' src={game.predictedWinner === 'home' ? game.awayTeamDetails.lightLogo : game.homeTeamDetails.lightLogo} alt={game.predictedWinner === 'home' ? game.awayTeamDetails.abbreviation : game.homeTeamDetails.abbreviation} />
                        <span className='font-semibold text-white'>{game.predictedWinner === 'home' ? game.awayTeamDetails.abbreviation : game.homeTeamDetails.abbreviation}</span>
                    </div>
                </div>

                {/* Stake / Profit */}
                <div className='flex justify-between text-xs text-gray-200'>
                    <span>Stake: <span className='text-green-400 font-medium'>${game.stake.toFixed(2)}</span></span>
                    <span>EX Profit: <span className='text-green-400 font-medium'>${game.expectedProfit.toFixed(2)}</span></span>
                </div>

                {/* Remaining Bankroll */}
                <div className='text-xs text-gray-400'>
                    {/* Remaining Bankroll: <span className='text-yellow-400 font-medium'>${game.tempBankroll.toFixed(2)}</span> */}
                </div>
            </div>
        </div>
    );
};

export default KelleyBetCard;