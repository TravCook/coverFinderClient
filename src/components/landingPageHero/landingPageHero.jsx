import React from 'react';
import LandingPageHeroCard from './landingPageHeroCard.jsx';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds } from '../../utils/constants.js';

const LandingPageHero = () => {
    const sportsbooks = [
        "betonlineag", "betmgm", "betrivers", "betus", "bovada", "williamhill_us",
        "draftkings", "fanatics", "fanduel", "lowvig", "mybookieag", "ballybet",
        "betanysports", "betparx", "espnbet", "fliff", "hardrockbet", "rebet", "windcreek"
    ];

    const { pastGames } = useSelector((state) => state.games);

    return (
        <div className="flex justify-center p-6 bg-background text-white">
            <div className="w-full  bg-secondary border border-secondary rounded-lg shadow-md p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">BEAT THE SPORTSBOOKS</h1>
                    <p className="text-sm text-gray-300">Use our AI Powered Predictions to make a Profit</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {
                        sportsbooks
                            .sort((a, b) => {
                                const getProfit = (sportsbookKey) => {
                                    return pastGames
                                        .filter(game =>
                                            game.bookmakers.some(b => b.key === sportsbookKey) &&
                                            game.predictedWinner
                                        )
                                        .reduce((acc, game) => {
                                            const bookmaker = game.bookmakers.find(b => b.key === sportsbookKey);
                                            const outcome = bookmaker?.markets.find(m => m.key === 'h2h')
                                                ?.outcomes.find(o =>
                                                    o.name === (
                                                        game.predictedWinner === 'home'
                                                            ? game.homeTeamDetails.espnDisplayName
                                                            : game.awayTeamDetails.espnDisplayName
                                                    )
                                                );

                                            if (game.predictionCorrect === true && outcome) {
                                                return acc + calculateProfitFromUSOdds(outcome.price, 1);
                                            } else if (game.predictionCorrect === false) {
                                                return acc - 1;
                                            }
                                            return acc;
                                        }, 0);
                                };

                                return getProfit(b) - getProfit(a);
                            })
                            .slice(0, 6) // Top 6
                            .map((sportsbookKey) => (
                                <LandingPageHeroCard key={sportsbookKey} sportsbook={sportsbookKey} />
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

export default LandingPageHero;
