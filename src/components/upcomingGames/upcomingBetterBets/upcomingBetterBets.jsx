import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valueBetConditionCheck, isSameDay, valueBetConditionCloseCheck, calculateParlayOdds } from '../../../utils/constants';
import MatchupCard from '../../matchupCard/matchupCard.jsx';

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
        }).filter((game) => {
            return valueBetConditionCheck(sports, game, sportsbook)
        }).filter((game) => isSameDay(game.commence_time, new Date()))
            .sort((a, b) => {
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
                return a.commence_time - b.commence_time
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
        <div>
            {games.filter((game) => {
                return valueBetConditionCheck(sports, game, sportsbook)
            }).filter((game) => isSameDay(game.commence_time, new Date())).length > 0 &&
                <div className='bg-secondary flex flex-col m-4 rounded' >
                    <div className='flex flex-col md:flex-row justify-between' style={{ padding: '.5em', borderBottom: '1px solid #575757' }}>
                        <div>
                            BETTER BETS
                        </div>
                        <div>
                            {betterBetsParlay &&
                                <div>
                                    <span style={{ color: 'whitesmoke' }}>{`Make it a parlay: ${betterBetsParlay.american > 0 ? '+' : ''}${betterBetsParlay.american}`}</span>
                                </div>}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row justify-evenly items-center' style={{ padding: '.5em 0' }}>
                        {betterBets && betterBets // Sort by commence time
                            .map((game) => {
                                return (
                                    <MatchupCard
                                        gameData={game}
                                    />
                                )
                            })}
                    </div>
                </div>
            }
        </div>
    );
};

export default UpcomingBetterBets;