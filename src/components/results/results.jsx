import { useState } from 'react'
import { valueBetConditionCheck, calculateProfitFromUSOdds } from '../../utils/constants.js';
import { kelleyBetSizeCalc } from '../../utils/helpers/bettingDataHelpers/helperFunctions.js';
import { useDispatch, useSelector } from 'react-redux';
import LineGraph from '../dataVisComponents/lineGraph/lineGraph.jsx';

const Results = () => {
    const dispatch = useDispatch()
    const { sportsbook } = useSelector((state) => state.user);
    const { pastGames, sports } = useSelector((state) => state.games)
    const [stake, setStake] = useState(1)

    const today = new Date()
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 8);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 16);
    fifteenDaysAgo.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 31);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Group games by day
    const groupedByDay = [...pastGames].sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)).reduce((acc, game) => {
        const dateKey = new Date(game.commence_time).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(game);
        return acc;
    }, {});

    // Helper to get winrate arrays
    const getWinRateArrays = (fromDate) => {
        const winRate = [];
        const valueWinRate = [];
        const cumulativeWinrate = [];
        const cumulativeValueWinrate = [];
        let cumulativeAllWins = 0;
        let cumulativeAllTotal = 0;

        let cumulativeValueWins = 0;
        let cumulativeValueTotal = 0;
        Object.keys(groupedByDay)
            .filter(day => new Date(day) > fromDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .forEach(day => {
                const games = groupedByDay[day];
                // All games winrate
                const totalGames = games.length;
                const wins = games.filter(game => game.predictionCorrect === true).length;
                winRate.push({
                    date: day,
                    winrate: totalGames > 0 ? (wins / totalGames) * 100 : 0
                });
                // Cumulative all games winrate
                cumulativeAllWins += wins;
                cumulativeAllTotal += totalGames;
                cumulativeWinrate.push({
                    date: day,
                    winrate: cumulativeAllTotal > 0 ? (cumulativeAllWins / cumulativeAllTotal) * 100 : 0
                });
                // Value bet games winrate
                const valueGames = games.filter(game => valueBetConditionCheck(sports, game, 'fanduel', 'h2h'));
                const valueWins = valueGames.filter(game => game.predictionCorrect === true).length;
                valueWinRate.push({
                    date: day,
                    winrate: valueGames.length > 0 ? (valueWins / valueGames.length) * 100 : 0
                });
                // Cumulative value bet games winrate
                cumulativeValueWins += valueWins;
                cumulativeValueTotal += valueGames.length;
                cumulativeValueWinrate.push({
                    date: day,
                    winrate: cumulativeValueTotal > 0 ? (cumulativeValueWins / cumulativeValueTotal) * 100 : 0
                });
            });
        return { winRate, valueWinRate, cumulativeWinrate, cumulativeValueWinrate };
    };

    // Helper to get profit arrays
    const getProfitArrays = (fromDate) => {
        const profitArray = [];
        const valueProfitArray = [];
        const cumulativeProfitArray = [];
        const cumulativeValueProfitArray = [];
        let cumulativeProfit = 0;
        let cumulativeValueProfit = 0;

        Object.keys(groupedByDay)
            .filter(day => new Date(day) > fromDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .forEach(day => {
                const games = groupedByDay[day];

                // All games profit
                let dayProfit = 0;
                games.forEach(game => {
                    const bookmaker = game.bookmakers.find(b => b.key === sportsbook);
                    const outcome = bookmaker?.markets.find(m => m.key === 'h2h')
                        ?.outcomes.find(o =>
                            o.name === (
                                game.predictedWinner === 'home'
                                    ? game.homeTeamDetails.espnDisplayName
                                    : game.awayTeamDetails.espnDisplayName
                            )
                        );
                    if (outcome) {
                        if (game.predictionCorrect === true) {
                            dayProfit += calculateProfitFromUSOdds(outcome.price, kelleyBetSizeCalc(game, outcome)); // assumes decimal odds
                        } else {
                            dayProfit -= kelleyBetSizeCalc(game, outcome);
                        }
                    }

                });
                profitArray.push({
                    date: day,
                    profit: dayProfit
                });
                cumulativeProfit += dayProfit;
                cumulativeProfitArray.push({
                    date: day,
                    profit: cumulativeProfit
                });

                // Value bet games profit
                const valueGames = games.filter(game => valueBetConditionCheck(sports, game, 'fanduel', 'h2h'));
                let dayValueProfit = 0;
                valueGames.forEach(game => {
                    const bookmaker = game.bookmakers.find(b => b.key === sportsbook);
                    const outcome = bookmaker?.markets.find(m => m.key === 'h2h')
                        ?.outcomes.find(o =>
                            o.name === (
                                game.predictedWinner === 'home'
                                    ? game.homeTeamDetails.espnDisplayName
                                    : game.awayTeamDetails.espnDisplayName
                            )
                        );
                    if (outcome) {
                        if (game.predictionCorrect === true) {
                            dayValueProfit += calculateProfitFromUSOdds(outcome.price, kelleyBetSizeCalc(game, outcome)); // assumes decimal odds
                        } else {
                            dayValueProfit -= kelleyBetSizeCalc(game, outcome);
                        }
                    }
                });
                valueProfitArray.push({
                    date: day,
                    profit: dayValueProfit
                });
                cumulativeValueProfit += dayValueProfit;
                cumulativeValueProfitArray.push({
                    date: day,
                    profit: cumulativeValueProfit
                });
            });
        return { profitArray, valueProfitArray, cumulativeProfitArray, cumulativeValueProfitArray };
    };


    // Get datasets for each period
    const last7Days = getWinRateArrays(sevenDaysAgo);
    const last15Days = getWinRateArrays(fifteenDaysAgo);
    const last30Days = getWinRateArrays(thirtyDaysAgo);

    const last7DaysProfit = getProfitArrays(sevenDaysAgo);
    const last15DaysProfit = getProfitArrays(fifteenDaysAgo);
    const last30DaysProfit = getProfitArrays(thirtyDaysAgo);

    return (
        <div className="bg-secondary flex flex-col my-2 rounded w-[97%]">
            <div className="flex flex-wrap justify-evenly items-stretch gap-4 my-4">
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 7 Days Win Rate</h4>
                    <LineGraph data={last7Days.winRate} secondData={last7Days.valueWinRate} winrates={true} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 7 Days Cumulative Win Rates</h4>
                    <LineGraph data={last7Days.cumulativeWinrate} secondData={last7Days.cumulativeValueWinrate} winrates={true} />
                </div>
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 15 Days Win Rate</h4>
                    <LineGraph data={last15Days.winRate} secondData={last15Days.valueWinRate} winrates={true} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 15 Days Cumulative Win Rates</h4>
                    <LineGraph data={last15Days.cumulativeWinrate} secondData={last15Days.cumulativeValueWinrate} winrates={true} />
                </div>
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 30 Days Win Rate</h4>
                    <LineGraph data={last30Days.winRate} secondData={last30Days.valueWinRate} winrates={true} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 30 Days Cumulative Win Rates</h4>
                    <LineGraph data={last30Days.cumulativeWinrate} secondData={last30Days.cumulativeValueWinrate} winrates={true} />
                </div>
            </div>
            <div className="flex flex-wrap justify-evenly items-stretch gap-4 my-4">
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 7 Days Profit</h4>
                    <LineGraph data={last7DaysProfit.profitArray} secondData={last7DaysProfit.valueProfitArray} winrates={false} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 7 Days Cumulative Profits</h4>
                    <LineGraph data={last7DaysProfit.cumulativeProfitArray} secondData={last7DaysProfit.cumulativeValueProfitArray} winrates={false} />
                </div>
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 15 Days Profit</h4>
                    <LineGraph data={last15DaysProfit.profitArray} secondData={last15DaysProfit.valueProfitArray} winrates={false} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 15 Days Cumulative Profits</h4>
                    <LineGraph data={last15DaysProfit.cumulativeProfitArray} secondData={last15DaysProfit.cumulativeValueProfitArray} winrates={false} />
                </div>
                <div className="bg-primary rounded p-4 flex-1 min-w-[25rem] max-w-[38rem]">
                    <h4 className="text-center text-white font-semibold mb-2">Last 30 Days Profit</h4>
                    <LineGraph data={last30DaysProfit.profitArray} secondData={last30DaysProfit.valueProfitArray} winrates={false} />
                    <h4 className="text-center text-white font-semibold mt-4 mb-2">Last 30 Days Cumulative Profits</h4>
                    <LineGraph data={last30DaysProfit.cumulativeProfitArray} secondData={last30DaysProfit.cumulativeValueProfitArray} winrates={false} />
                </div>
            </div>
        </div>
    )
}

export default Results
