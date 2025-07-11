import React from 'react';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds, getLuminance, hexToRgb } from '../../utils/constants';
import OddsDisplayBox from '../matchupCard/oddsDisplayBox/oddsDisplayBox.jsx';

const LandingPageHeroCard = ({ sportsbook }) => {
    const { pastGames } = useSelector((state) => state.games);
    let bgLum = getLuminance(hexToRgb('#2a2a2a')[0], hexToRgb('#2a2a2a')[1], hexToRgb('#2a2a2a')[2]);

    let sportsbookGames = pastGames.filter(game =>
        game.bookmakers.some(b => b.key === sportsbook)
    );

    let predictionsMade = sportsbookGames.filter(game => game.predictedWinner);

    let valueProfit = predictionsMade.reduce((acc, game) => {
        const bookmaker = game.bookmakers.find(b => b.key === sportsbook);
        if (!bookmaker) return acc;

        const outcome = bookmaker.markets.find(m => m.key === 'h2h')?.outcomes.find(o =>
            o.name === (game.predictedWinner === 'home'
                ? game.homeTeamDetails.espnDisplayName
                : game.awayTeamDetails.espnDisplayName)
        );

        if (game.predictionCorrect === true && outcome) {
            return acc + calculateProfitFromUSOdds(outcome.price, 1);
        } else if (game.predictionCorrect === false) {
            return acc - 1;
        }
        return acc;
    }, 0);

    const winPercentage = predictionsMade.length > 0
        ? predictionsMade.filter(game => game.predictionCorrect).length / predictionsMade.length * 100
        : 0;

    const ROI = predictionsMade.length > 0
        ? (valueProfit / predictionsMade.length) * 100
        : 0;
    return (
        <div className="bg-primary border border-primary text-white w-full p-4 rounded shadow-md">
            <h2 className="text-center text-lg font-bold mb-4">{sportsbook}</h2>
            <div className="flex justify-around text-sm text-center mb-4">
                <div>
                    <div className="font-semibold">Profit</div>
                    <div>${valueProfit.toFixed(2)}</div>
                </div>
                <div>
                    <div className="font-semibold">ROI</div>
                    <div>{ROI.toFixed(2)}%</div>
                </div>
                <div>
                    <div className="font-semibold">Win %</div>
                    <div>{winPercentage.toFixed(2)}%</div>
                </div>
            </div>

            <div className="space-y-3">
                {
                    predictionsMade
                        .filter(game => game.predictionCorrect === true)
                        .sort((a, b) => {
                            const getProfit = (game) => {
                                const outcome = game.bookmakers.find(b => b.key === sportsbook)
                                    ?.markets.find(m => m.key === 'h2h')
                                    ?.outcomes.find(o =>
                                        o.name === (game.predictedWinner === 'home'
                                            ? game.homeTeamDetails.espnDisplayName
                                            : game.awayTeamDetails.espnDisplayName)
                                    );
                                return outcome ? calculateProfitFromUSOdds(outcome.price, 1) : 0;
                            };

                            return getProfit(b) - getProfit(a);
                        })
                        .slice(0, 5)
                        .map((game) => {
                            const outcome = game.bookmakers.find(b => b.key === sportsbook)
                                ?.markets.find(m => m.key === 'h2h')
                                ?.outcomes.find(o =>
                                    o.name === (game.predictedWinner === 'home'
                                        ? game.homeTeamDetails.espnDisplayName
                                        : game.awayTeamDetails.espnDisplayName)
                                );

                            return (
                                <div key={game.id} className="flex items-center justify-between bg-secondary p-2 rounded">
                                    <div className="flex items-center space-x-2">
                                        <img
                                            className="w-6"
                                            src={game.predictedWinner === 'home'
                                                ? bgLum > .5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo
                                                : bgLum > .5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo}
                                            alt="logo"
                                        />
                                        <span>{game.predictedWinner === 'home' ? 'vs' : '@'}</span>
                                        <img
                                            className="w-6"
                                            src={game.predictedWinner === 'home'
                                                ? bgLum > .5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo
                                                : bgLum > .5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo}
                                            alt="logo"
                                        />
                                        <span className="text-xs text-gray-300">
                                            {game.commence_time
                                                ? new Date(game.commence_time).toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <OddsDisplayBox gameData={game} market="h2h" homeAway={game.predictedWinner} />
                                </div>
                            );
                        })
                }
            </div>
        </div>
    );
};

export default LandingPageHeroCard;
