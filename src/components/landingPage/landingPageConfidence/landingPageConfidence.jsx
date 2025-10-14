import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isSameDay, valueBetConditionCheck } from '../../../utils/constants.js';
import MatchupCard from '../../matchupCard/matchupCard.jsx';

const LandingPageConfidence = () => {
    const { games, sports } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user);

    let betterBets = games.filter((game) => {
        if (game?.bookmakers?.find(b => b.key === sportsbook)) {
            return true
        }
        return null
    }).filter((game) => !game.timeRemaining)
        .filter((game) => isSameDay(new Date(game.commence_time), new Date()))
        .filter((game) => {
            return valueBetConditionCheck(sports, game, sportsbook, 'h2h')
                || valueBetConditionCheck(sports, game, sportsbook, 'spreads')
                || valueBetConditionCheck(sports, game, sportsbook, 'totals')
        })

    return (
        <div className='my-4 flex-grow' style={{ maxWidth: '90%' }}>
            {games.filter((game) => {
                return game.predictionConfidence > .90 && isSameDay(new Date(game.commence_time), new Date())
            }).slice(0, betterBets.length / 2).length > 0 &&
                <div className='bg-secondary flex flex-col rounded' >
                    <div style={{ padding: '.5em', borderBottom: '1px solid #575757' }}>
                        <div>
                            {`LOCKS`}
                        </div>

                    </div>
                    <div className='flex flex-row flex-wrap justify-evenly p-4 gap-2' style={{ padding: '.5em 0' }}>
                        {games.filter((game) => game.predictionConfidence > .90 && isSameDay(new Date(game.commence_time), new Date())) && games.filter((game) => game.predictionConfidence > .90 && isSameDay(new Date(game.commence_time), new Date())) // Sort by commence time
                            .slice(0, betterBets.length / 3).sort((a, b) => b.predictionConfidence - a.predictionConfidence).map((game) => {
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

export default LandingPageConfidence;