import { getDifferenceInMinutes, formatMinutesToHoursAndMinutes, getLuminance, hexToRgb, valueBetConditionCheck } from '../../utils/constants.js';
import MatchupCard from '../matchupCard/matchupCard.jsx';
import { useSelector } from 'react-redux';
import PastGamesDisplay from '../pastGames/pastGames.jsx';
import PastGameCard from '../pastGames/pastGameCard.jsx';
import { useEffect, useState } from 'react';

const LiveView = () => {
    const { games, pastGames, sports } = useSelector((state) => state.games);
    const { sportsbook } = useSelector((state) => state.user)
    let today = new Date();
    let startOfnewModel = new Date(2025, 7, 28)
    // startOfnewModel.setDate(startOfnewModel.getDate() - 1)
    startOfnewModel.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    const [spreadValueBets, setSpreadValueBets] = useState()
    const [spreadValueHits, setSpreadValueHits] = useState()
    const [predictedTotals, setPredictedTotals] = useState()
    const [totalHits, setTotalHits] = useState()

    useEffect(() => {


        let tempValueBets = [...pastGames].filter((game) => new Date(game.commence_time) > startOfnewModel).filter((game) => {
            return valueBetConditionCheck(sports, game, sportsbook, 'spreads', 'away') || valueBetConditionCheck(sports, game, sportsbook, 'spreads', 'home')
        })
        setSpreadValueBets(tempValueBets)

        let tempValueHits = [...tempValueBets].filter((game) => {
            let gameSport = sports?.find((sport) => sport.name === game.sport_key)
            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'spreads')?.outcomes

            if (!outcomes || outcomes.length === 0) return false

            return outcomes.some((outcome) => {
                let vegasSpread = outcome.point

                let outcomeScore = (outcome.name === game.homeTeamDetails.espnDisplayName ? game.homeScore : game.awayScore)
                let opponentScore = (outcome.name === game.homeTeamDetails.espnDisplayName ? game.awayScore : game.homeScore)

                let spreadCovered = (outcomeScore + vegasSpread ) > opponentScore
                return spreadCovered
                 && valueBetConditionCheck(sports, game, sportsbook, 'spreads', outcome.name === game.homeTeamDetails.espnDisplayName ? 'home' : 'away')
            })
        })
        setSpreadValueHits(tempValueHits)

        let tempOvers = [...pastGames].filter((game) => new Date(game.commence_time) > startOfnewModel).filter((game) => {
            let gameSport = sports?.find((sport) => sport.name === game.sport_key)
            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'totals')?.outcomes

            if (!outcomes || outcomes.length === 0) return false
            let totalMAE = gameSport.hyperParams[0].totalMAE
            return outcomes.some((outcome) => {
                let vegasTotal = outcome.point
                let predictedTotal = game.predictedAwayScore + game.predictedHomeScore

                return predictedTotal - 0 > vegasTotal
            })
        })

        let tempUnders = [...pastGames].filter((game) => new Date(game.commence_time) > startOfnewModel).filter((game) => {
            let gameSport = sports?.find((sport) => sport.name === game.sport_key)
            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'totals')?.outcomes

            if (!outcomes || outcomes.length === 0) return false
            let totalMAE = gameSport.hyperParams[0].totalMAE
            return outcomes.some((outcome) => {
                let vegasTotal = outcome.point
                let predictedTotal = game.predictedAwayScore + game.predictedHomeScore

                return predictedTotal + 0 < vegasTotal
            })
        })

        setPredictedTotals({
            overs: tempOvers,
            unders: tempUnders
        })

        let tempOverHits = tempOvers.filter((game) => {
            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'totals')?.outcomes

            if (!outcomes || outcomes.length === 0) return false
            return outcomes.some((outcome) => {
                let vegasTotal = outcome.point
                let totalScore = game.awayScore + game.homeScore

                return totalScore > vegasTotal
            })
        })

        let tempUnderHits = tempUnders.filter((game) => {
            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'totals')?.outcomes

            if (!outcomes || outcomes.length === 0) return false
            return outcomes.some((outcome) => {
                let vegasTotal = outcome.point
                let totalScore = game.awayScore + game.homeScore

                return totalScore < vegasTotal
            })
        })

        setTotalHits({
            overs: tempOverHits,
            unders: tempUnderHits
        })
    }, [games, pastGames])


    return (
        <div className='flex flex-col items-center'>
            <title>Live Now</title>
            <div className='w-full'>
                <div>
                    <div className='flex flex-row justify-center gap-2'>
                        {games.filter((game) => {
                            const diff = getDifferenceInMinutes(new Date(), new Date(game.commence_time));
                            return !game.timeRemaining && diff < 180 && diff > 0;
                        }).length > 0 &&
                            <div className=' bg-secondary my-4 rounded px-2' style={{ width: '12%' }} >
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <h4 className="text-white mb-2">Starting Soon</h4>
                                                <div className='flex flex-row flex-wrap justify-center'>
                                                    {games
                                                        .filter((game) => {
                                                            const diff = getDifferenceInMinutes(new Date(), new Date(game.commence_time));
                                                            return !game.timeRemaining && diff < 180 && diff > 0;
                                                        })
                                                        .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time))
                                                        .map((game, idx) => {
                                                            let bgLum = getLuminance(hexToRgb('#545454')[0], hexToRgb('#545454')[1], hexToRgb('#545454')[2]);
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="flex flex-row items-center border m-1 justify-between rounded bg-primary w-full"
                                                                // style={{ width: '48%' }}
                                                                >
                                                                    <div className='flex flex-col flex-grow'>
                                                                        <div className='border-b flex flex-row gap-1 items-center p-1'>
                                                                            <div style={{ width: '1.5rem' }}><img src={bgLum < 0.5 ? game.awayTeamDetails.lightLogo : game.awayTeamDetails.darkLogo} /></div>
                                                                            <div className='flex flex-row w-full'>
                                                                                <div>{game.awayTeamDetails.teamName}{game.predictedWinner === 'away' && (
                                                                                    <sup style={{
                                                                                        marginLeft: '.2rem',
                                                                                        fontSize: '.6rem',
                                                                                        color: `hsl(${((game.awayTeamScaledIndex) / 45) * 120}, 100%, 50%)`
                                                                                    }}>▲</sup>
                                                                                )}</div>
                                                                            </div>

                                                                        </div>
                                                                        <div className='border-t flex flex-row gap-1 items-center p-1'>
                                                                            <div style={{ width: '1.5rem' }}><img src={bgLum < 0.5 ? game.homeTeamDetails.lightLogo : game.homeTeamDetails.darkLogo} /></div>
                                                                            <div className='flex flex-row w-full'>
                                                                                <div>{game.homeTeamDetails.teamName}{game.predictedWinner === 'home' && (
                                                                                    <sup style={{
                                                                                        marginLeft: '.2rem',
                                                                                        fontSize: '.6rem',
                                                                                        color: `hsl(${((game.homeTeamScaledIndex) / 45) * 120}, 100%, 50%)`
                                                                                    }}>▲</sup>
                                                                                )}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex flex-col' style={{ width: `${getDifferenceInMinutes(new Date(), new Date(game.commence_time)) >= 59 ? 30 : 20}%` }}>
                                                                        <div></div>
                                                                        <div style={{ textAlign: 'center' }}>{formatMinutesToHoursAndMinutes(getDifferenceInMinutes(new Date(), new Date(game.commence_time)).toFixed(0))}</div>
                                                                        <div></div>
                                                                    </div>

                                                                </div>
                                                            )
                                                        }
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className=' bg-secondary my-4 rounded' style={{
                            width: `${games.filter((game) => {
                                const diff = getDifferenceInMinutes(new Date(), new Date(game.commence_time));
                                return !game.timeRemaining && diff < 180 && diff > 0;
                            }).length > 0 ? 82 : 95}%`
                        }}>
                            <div>
                                <div>
                                    <div className='flex flex-row flex-wrap justify-center p-4 gap-2'>
                                        {games.filter((game) => game.timeRemaining).sort((a, b) => {
                                            return new Date(a.commence_time) - new Date(b.commence_time)
                                        }).map((game) => {
                                            return (
                                                <div>
                                                    <MatchupCard
                                                        key={game.id}
                                                        gameData={game}
                                                    />
                                                </div>

                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {pastGames.filter((game) => new Date(game.commence_time) > today).length > 0 ?
                <div className='w-[95%]'>
                    <PastGamesDisplay displayGames={pastGames.filter((game) => new Date(game.commence_time) > today)} />
                </div> :
                <div className='w-[95%]'>
                    <PastGamesDisplay displayGames={pastGames.filter((game) => new Date(game.commence_time) > startOfnewModel)} />
                </div>}
            <div className='flex flex-col bg-secondary my-2 w-[95%]'>
                <div style={{ textAlign: 'center' }}>
                    {`Spreads Beaten ${spreadValueHits?.length} / ${spreadValueBets?.length} ${((spreadValueHits?.length) / (spreadValueBets?.length) * 100).toFixed(2)}%`}
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row flex-wrap gap-2 w-[50%] justify-evenly border-r'>
                        {spreadValueHits?.sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time)).map((game) => {
                            return (
                                <div>
                                    <PastGameCard game={game} market='spreads' />
                                </div>

                            )
                        })}
                    </div>
                    <div className='flex flex-row flex-wrap gap-2 w-[50%] justify-evenly border-l'>
                        {spreadValueBets?.filter((game) => {
                            let outcomes = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'spreads')?.outcomes

                            if (!outcomes || outcomes.length === 0) return false
                            return outcomes.some((outcome) => {
                                let vegasSpread = outcome.point

                                let outcomeScore = (outcome.name === game.homeTeamDetails.espnDisplayName ? game.homeScore : game.awayScore)
                                let opponentScore = (outcome.name === game.homeTeamDetails.espnDisplayName ? game.awayScore : game.homeScore)

                                let spreadCovered = (outcomeScore + vegasSpread) > opponentScore
                                return !spreadCovered && valueBetConditionCheck(sports, game, sportsbook, 'spreads', outcome.name === game.homeTeamDetails.espnDisplayName ? 'home' : 'away')
                            })
                        }).sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time)).map((game) => {
                            return (
                                <div>
                                    <PastGameCard game={game} market='spreads' />
                                </div>

                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='flex flex-row bg-secondary my-2 w-[95%]'>
                <div className='flex flex-col w-[50%] border-r'>
                    <div style={{ textAlign: 'center' }}>
                        {`Over ${totalHits?.overs.length}/${predictedTotals?.overs.length} ${((totalHits?.overs.length/predictedTotals?.overs.length)* 100).toFixed(2)}%`}
                    </div>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {totalHits?.overs.map((game) => {
                            return (
                                <div className='w-[20%]'>
                                    <PastGameCard game={game} market={'totals'} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='flex flex-col w-[50%] border-l'>
                    <div style={{ textAlign: 'center' }}>
                        {`Under ${totalHits?.unders.length}/${predictedTotals?.unders.length} ${((totalHits?.unders.length/predictedTotals?.unders.length)* 100).toFixed(2)}%`}
                    </div>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {totalHits?.unders.map((game) => {
                            return (
                                <div className='w-[20%]'>
                                    <PastGameCard game={game} market={'totals'}  />
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default LiveView;