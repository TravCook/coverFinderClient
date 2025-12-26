import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    calculateProfitFromUSOdds,
    getLuminance,
    hexToRgb,
    valueBetConditionCheck,
} from '../../../utils/constants.js';
import OddsDisplayBox from '../../matchupCard/oddsDisplayBox/oddsDisplayBox.jsx';

const LandingPageHeroCard = ({ sportsbook }) => {
    const { pastGames, sports } = useSelector((state) => state.games);

    // Calculate luminance for logo selection
    const bgLum = getLuminance(...hexToRgb('#2a2a2a'));

    // Derived stats using useMemo
    const {
        sportsbookWinRate,
        modelWinRate,
        sportsbookValueWinRate,
        modelValueWinRate,
        ROIforSportsbook,
        ROIforModel,
        bbPredictionsSorted,
    } = useMemo(() => {
        const cutoffDate = new Date(2025, 9, 7);

        // --- Helper: check if a game is valid for comparison ---
        const isRecentGame = (game) => new Date(game.commence_time) > cutoffDate;

        const sportsbookGames = pastGames
            .filter(isRecentGame)
            .filter((game) =>
                game.bookmakers.some((b) => b.key === sportsbook)
            );

        // --- Sportsbook Win Rate ---
        const validSBGames = sportsbookGames.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const market = bookmaker?.markets.find((m) => m.key === 'h2h');
            if (!market) return false;
            const outcomes = market.outcomes;
            // require one favorite, one underdog
            return outcomes && outcomes.some((o) => o.price < 0) && outcomes.some((o) => o.price > 0);
        });

        const sbWins = validSBGames.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const favorite = bookmaker.markets
                .find((m) => m.key === 'h2h')
                ?.outcomes.find((o) => o.price < 0);
            if (!favorite) return false;

            const winnerName =
                game.winner === 'home'
                    ? game.homeTeamDetails.espnDisplayName
                    : game.awayTeamDetails.espnDisplayName;

            return favorite.name === winnerName;
        }).length;

        const sportsbookWinRate = validSBGames.length ? sbWins / validSBGames.length : 0;

        // --- Your Model Win Rate (all predictions) ---
        const predictionsMade = pastGames
            .filter(isRecentGame)
            .filter((game) => game.predictedWinner);

        const modelWins = predictionsMade.filter((game) => game.predictionCorrect).length;
        const modelWinRate = predictionsMade.length ? modelWins / predictionsMade.length : 0;

        // --- Filter: Value Bets ---
        const valueGames = predictionsMade.filter((game) =>
            valueBetConditionCheck(sports, game, sportsbook, 'h2h')
        );

        // Sportsbook win rate only among your value bets
        const validValueSBGames = valueGames.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const market = bookmaker?.markets.find((m) => m.key === 'h2h');
            if (!market) return false;
            const outcomes = market.outcomes;
            return outcomes && outcomes.some((o) => o.price < 0) && outcomes.some((o) => o.price > 0);
        });

        const sbValueWins = validValueSBGames.filter((game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const favorite = bookmaker.markets
                .find((m) => m.key === 'h2h')
                ?.outcomes.find((o) => o.price < 0);
            if (!favorite) return false;

            const winnerName =
                game.winner === 'home'
                    ? game.homeTeamDetails.espnDisplayName
                    : game.awayTeamDetails.espnDisplayName;

            return favorite.name === winnerName;
        }).length;

        const sportsbookValueWinRate = validValueSBGames.length ? sbValueWins / validValueSBGames.length : 0;

        // --- Your model win rate among Value Bets ---
        const modelValueWins = valueGames.filter((game) => game.predictionCorrect).length;
        const modelValueWinRate = valueGames.length ? modelValueWins / valueGames.length : 0;

        // --- ROI for model (using Kelly stake) ---
        const valueProfit = valueGames.reduce((acc, game) => {
            const bookmaker = game.bookmakers.find(b => b.key === sportsbook);
            const outcome = bookmaker?.markets
                .find(m => m.key === 'h2h')
                ?.outcomes.find(o =>
                    o.name === (
                        game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName
                    )
                );

            if (!outcome) return acc; // skip missing outcomes

            // Convert American odds to decimal if needed
            let decimalOdds = outcome.price;
            if (Math.abs(decimalOdds) > 10) { // likely American odds
                decimalOdds = decimalOdds > 0 ? 1 + decimalOdds / 100 : 1 - 100 / decimalOdds;
            }

            const b = decimalOdds - 1; // net odds for Kelly
            const p = game.predictionConfidence; // model confidence
            const q = 1 - p;

            // Full Kelly fraction
            let f = (b * p - q) / b;

            // Optional: cap Kelly fraction to avoid overbetting
            f = Math.max(0, f); // don't bet negative
            const bankroll = 100; // example bankroll, you can adjust dynamically
            const stake = f * bankroll;

            if (game.predictionCorrect === true) {
                return acc + calculateProfitFromUSOdds(outcome.price, stake);
            } else if (game.predictionCorrect === false) {
                return acc - stake;
            }

            return acc;
        }, 0);


        const ROIforModel = valueGames.length ? (valueProfit / valueGames.length) * 100 : 0;

        // --- Top 3 winning predictions by payout ---
        const getProfit = (game) => {
            const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
            const outcome = bookmaker?.markets
                .find((m) => m.key === 'h2h')
                ?.outcomes.find(
                    (o) =>
                        o.name ===
                        (game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName)
                );
            return outcome ? calculateProfitFromUSOdds(outcome.price, 1) : 0;
        };

        const bbPredictionsSorted = valueGames
            .filter((game) => game.predictionCorrect)
            .sort((a, b) => getProfit(b) - getProfit(a))
            .slice(0, 3);

        return {
            sportsbookWinRate,
            modelWinRate,
            sportsbookValueWinRate,
            modelValueWinRate,
            ROIforModel,
            bbPredictionsSorted,
        };
    }, [pastGames, sportsbook, sports]);


    // Uniform stat box
    const StatBox = ({ label, value }) => (
        <div className="flex flex-col items-center w-1/3">
            <div className="font-semibold text-xs text-gray-300">{label}</div>
            <div className="text-base font-bold">{value}</div>
        </div>
    );

    // Uniform game row
    const GameRow = ({ game }) => {
        const homeLogo =
            bgLum > 0.5
                ? game.homeTeamDetails.lightLogo
                : game.homeTeamDetails.darkLogo;
        const awayLogo =
            bgLum > 0.5
                ? game.awayTeamDetails.lightLogo
                : game.awayTeamDetails.darkLogo;

        // Always show predicted winner on the left
        const predictedWinnerIsHome = game.predictedWinner === 'home';
        const leftLogo = predictedWinnerIsHome ? homeLogo : awayLogo;
        const rightLogo = predictedWinnerIsHome ? awayLogo : homeLogo;
        const leftTeamName = predictedWinnerIsHome
            ? game.homeTeamDetails.espnDisplayName
            : game.awayTeamDetails.espnDisplayName;
        const rightTeamName = predictedWinnerIsHome
            ? game.awayTeamDetails.espnDisplayName
            : game.homeTeamDetails.espnDisplayName;

        return (
            <div
                key={game.id}
                className="flex items-center bg-secondary rounded-lg px-3 py-2 mb-2 shadow-sm"
            >
                <div className="flex items-center w-1/2">
                    <img className="w-7 h-7 object-contain" src={leftLogo} alt="logo" />
                    <span className="mx-2 text-gray-400 text-xs">vs</span>
                    <img className="w-7 h-7 object-contain" src={rightLogo} alt="logo" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-300">
                    {game.commence_time
                        ? new Date(game.commence_time).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                        })
                        : 'N/A'}
                </div>
                <div className="flex-1 flex justify-end">
                    <OddsDisplayBox gameData={game} market="h2h" homeAway={game.winner} />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col bg-primary border border-primary text-white rounded-lg w-full shadow-lg p-4">
            <h2 className="text-center text-lg font-bold mb-4 capitalize tracking-wide">
                {sportsbook}
            </h2>
            <div className="flex justify-between mb-4">
                <StatBox label="SB Win %" value={`${(sportsbookWinRate * 100).toFixed(2)}%`} />
                <StatBox label="BB Win %" value={`${(modelWinRate * 100).toFixed(2)}%`} />
            </div>
            <div className="flex justify-between mb-4">
                <StatBox label="SB Value Win %" value={`${(sportsbookValueWinRate * 100).toFixed(2)}%`} />
                <StatBox label="BB Value Win %" value={`${(modelValueWinRate * 100).toFixed(2)}%`} />
            </div>
            <div className="flex justify-between mb-4">
                <StatBox label="ROI (Value Bets)" value={`${ROIforModel.toFixed(2)}%`} />
            </div>


            <div className="space-y-2">
                {bbPredictionsSorted.map((game) => (
                    <GameRow key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

export default LandingPageHeroCard;
