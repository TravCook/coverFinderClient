import React from 'react';
import LandingPageHeroCard from './landingPageHeroCard.jsx';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds } from '../../../utils/constants.js';

const LandingPageHero = () => {
    const sportsbooks = [
        "betonlineag", "betmgm", "betrivers", "betus", "bovada", "williamhill_us",
        "draftkings", "fanatics", "fanduel", "lowvig", "mybookieag", "ballybet",
        "betanysports", "betparx", "espnbet", "fliff", "hardrockbet", "rebet", "windcreek"
    ];

    const { pastGames } = useSelector((state) => state.games);

    return (
        <div className="flex bg-background text-white my-2" style={{ width: '97%' }}>
            <div className="w-full  bg-secondary border border-secondary rounded-lg shadow-md">
                <div className="text-center m-8">
                    <h1 className="text-2xl font-bold">BEAT THE SPORTSBOOKS</h1>
                    <p className="text-sm text-gray-300">Use our AI Powered Predictions to make a Profit</p>
                </div>
                <div className="flex flex-row flex-wrap gap-4 px-2">
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
                                let sbAGames = pastGames.filter((game) => game.bookmakers.some(book => book.key === a))
                                let sbBGames = pastGames.filter((game) => game.bookmakers.some(book => book.key === b))
                                let aWinRate = sbAGames.length > 0 ? sbAGames.filter((game) => game.predictionCorrect === true).length / sbAGames.length : 0
                                let bWinRate = sbBGames.length > 0 ? sbBGames.filter((game) => game.predictionCorrect === true).length / sbBGames.length : 0
                                return bWinRate - aWinRate
                            })
                            .slice(0, 7) // Top 6
                            .map((sportsbookKey) => (
                                <div key={sportsbookKey} className="flex flex-grow mb-2">
                                    <LandingPageHeroCard sportsbook={sportsbookKey} />
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

export default LandingPageHero;
