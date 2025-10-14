import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck, isSameDay, valueBetConditionCloseCheck, calculateParlayOdds } from '../../../../utils/constants';
import MatchupCard from '../../../matchupCard/matchupCard.jsx';

const UpcomingBetterBets = () => {
    const { games, sports } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);
    const [betterBets, setBetterBets] = useState()
    const [betterBetsParlay, setBBParlay] = useState()
    useEffect(() => {
        let betterBetOutcomes = []
        let tempBetterBets = games.filter((game) => {
            if (game?.bookmakers?.find(b => b.key === sportsbook)) {
                return true
            }
            return null
        }).filter((game) => !game.timeRemaining)
            .filter((game) => isSameDay(new Date(game.commence_time), new Date()))
            .filter((game) => {
                return valueBetConditionCheck(sports, game, sportsbook, 'h2h')
                // || valueBetConditionCheck(sports, game, sportsbook, 'spreads')
                // || valueBetConditionCheck(sports, game, sportsbook, 'totals')
            }).sort((a, b) => {
                let outcomeA
                let outcomeB
                const bookmakerA = a.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
                if (bookmakerA) {
                    const marketData = bookmakerA?.markets?.find(m => m.key === 'h2h');

                    outcomeA = marketData?.outcomes?.find(o => {
                        return o.name === (a.predictedWinner === 'home' ? a.homeTeamDetails.espnDisplayName : a.awayTeamDetails.espnDisplayName)
                    });
                }
                const bookmakerB = b.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
                if (bookmakerB) {
                    const marketData = bookmakerB?.markets?.find(m => m.key === 'h2h');

                    outcomeB = marketData?.outcomes?.find(o => {
                        return o.name === (b.predictedWinner === 'home' ? a.homeTeamDetails.espnDisplayName : a.awayTeamDetails.espnDisplayName)
                    });
                }
                return new Date(a.commence_time) - new Date(b.commence_time)
                // return outcomeB.price - outcomeA.price
            })
        tempBetterBets.map((game) => {
            const bookmaker = game.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
            if (bookmaker) {
                const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');
                const outcome = marketData?.outcomes?.find(o => {
                    return o.name === (game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName)
                });
                betterBetOutcomes.push(outcome.price)
            }
        })
        let tempParlayOdds = calculateParlayOdds(betterBetOutcomes)
        setBBParlay(tempParlayOdds)
        setBetterBets(tempBetterBets)
    }, [games])
    return (
        <div className='my-4 flex-grow' style={{maxWidth: '90%'}}>
            {games.filter((game) => {
                return valueBetConditionCheck(sports, game, sportsbook, 'h2h', game.winner)
            }).length > 0 &&
                <div className='bg-secondary flex flex-col rounded' >
                    <div className='flex flex-col md:flex-row justify-between' style={{ padding: '.5em', borderBottom: '1px solid #575757' }}>
                        <div>
                            {`${new Date().toLocaleDateString('us-EN', {
                                day: '2-digit',
                                month: '2-digit'
                            })} BETTER BETS`}
                        </div>
                        <div>
                            {betterBetsParlay &&
                                <div>
                                    <span style={{ color: 'whitesmoke' }}>{`Make it a parlay: ${betterBetsParlay.american > 0 ? '+' : ''}${betterBetsParlay.american}`}</span>
                                </div>}
                        </div>
                    </div>
                    <div className='flex flex-row flex-wrap justify-center p-4 gap-2' style={{ padding: '.5em 0' }}>
                        {betterBets && betterBets // Sort by commence time
                            .map((game) => {
                                return (
                                    <div>
                                        <MatchupCard
                                            gameData={game}
                                        />
                                    </div>
                                )
                            })}
                    </div>
                </div>
            }
        </div>
    );
};

export default UpcomingBetterBets;