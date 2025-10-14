import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { calculateProfitFromUSOdds, getLuminance, hexToRgb, valueBetConditionCheck } from '../../../utils/constants.js';
import OddsDisplayBox from '../../matchupCard/oddsDisplayBox/oddsDisplayBox.jsx';

const LandingPageHeroCard = ({ sportsbook }) => {
    const { pastGames, sports } = useSelector((state) => state.games);
    const [sportsbookWinRate, setSportsbookWinRate] = useState()
    const [roiforSportsbook, setROIforSportsbook] = useState()
    const [bbPredictions, setBBPredictions] = useState()
    const [bbWinrate, setBBWinrate] = useState()
    let bgLum = getLuminance(hexToRgb('#2a2a2a')[0], hexToRgb('#2a2a2a')[1], hexToRgb('#2a2a2a')[2]);

    useEffect(() => {
        const thirtyDaysAgo = new Date(2025, 8, 4);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        let sportsbookGames = pastGames.filter(game =>
            game.bookmakers.some(b => b.key === sportsbook)
        ).filter((game) => {
            return new Date(game.commence_time) > new Date(thirtyDaysAgo)
        }).filter((game) => {
            return valueBetConditionCheck(sports, game, 'fanduel', 'h2h' )
        }).filter((game) => {
            let bookmaker = game.bookmakers.find(b => b.key === sportsbook);
            let outcomes = bookmaker?.markets.find(m => m.key === 'h2h')?.outcomes
            if (outcomes) {
                return !(outcomes[0].price < 0 && outcomes[1].price < 0)
            }

        })

        let tempSBWinrate = sportsbookGames.filter((game) => {
            const bookmaker = game.bookmakers.find(b => b.key === sportsbook);
            if (!bookmaker) return acc;

            const outcome = bookmaker.markets.find(m => m.key === 'h2h')?.outcomes.find(o =>
                o.price < 0
            );

            if (outcome.name === (game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName)) {
                return true
            }

        }).length / sportsbookGames.length

        setSportsbookWinRate(tempSBWinrate)

        let predictionsMade = sportsbookGames.filter(game => game.predictedWinner)
        setBBPredictions(predictionsMade)
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

        setROIforSportsbook(ROI)
        setBBWinrate(winPercentage)
    }, [pastGames])






    return (
        <div className=" flex flex-col bg-primary border border-primary text-white rounded w-full">
            <h2 className="text-center text-lg font-bold mb-4">{sportsbook}</h2>
            <div className="flex justify-around text-sm text-center mb-4">
                {sportsbookWinRate && <div>
                    <div className="font-semibold">SB Win %</div>
                    <div>{(sportsbookWinRate * 100).toFixed(2)}%</div>
                </div>}
                {roiforSportsbook && <div>
                    <div className="font-semibold">ROI</div>
                    <div>{roiforSportsbook.toFixed(2)}%</div>
                </div>}
                {bbWinrate && <div>
                    <div className="font-semibold">Win %</div>
                    <div>{bbWinrate.toFixed(2)}%</div>
                </div>}
            </div>

            {bbPredictions && <div className="space-y-3 p-2">
                {
                    bbPredictions
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
                        .slice(0, 3)
                        .map((game) => {
                            const outcome = game.bookmakers.find(b => b.key === sportsbook)
                                ?.markets.find(m => m.key === 'h2h')
                                ?.outcomes.find(o =>
                                    o.name === (game.predictedWinner === 'home'
                                        ? game.homeTeamDetails.espnDisplayName
                                        : game.awayTeamDetails.espnDisplayName)
                                );

                            return (
                                <div key={game.id} className="flex flex-row bg-secondary p-2">
                                    <div className="flex flex-row items-center w-full">
                                        <div className='w-[20%] '>
                                            <img
                                                style={{ maxWidth: '1.5rem' }}
                                                src={game.predictedWinner === 'home'
                                                    ? bgLum > .5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo
                                                    : bgLum > .5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo}
                                                alt="logo"
                                            />
                                        </div>
                                        <div className='w-[15%]'>
                                            <span>{game.predictedWinner === 'home' ? 'vs' : '@'}</span>
                                        </div>
                                        <div className='w-[20%]'>
                                            <img
                                                style={{ maxWidth: '1.5rem' }}
                                                src={game.predictedWinner === 'home'
                                                    ? bgLum > .5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo
                                                    : bgLum > .5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo}
                                                alt="logo"
                                            />
                                        </div>
                                        <div className='flex flex-grow' style={{ textAlign: 'center' }}>
                                            {/* <span className="text-gray-300"> */}
                                            {game.commence_time
                                                ? new Date(game.commence_time).toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })
                                                : 'N/A'}
                                            {/* </span> */}
                                        </div>
                                    </div>
                                    <OddsDisplayBox gameData={game} market="h2h" homeAway={game.predictedWinner} />
                                </div>
                            );
                        })
                }
            </div>}
        </div>
    );
};

export default LandingPageHeroCard;
