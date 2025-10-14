import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';

const DogRankings = ({ sport }) => {
    const { teams } = useSelector((state) => state.teams);
    const { sportsbook } = useSelector((state) => state.user);
    const { games, sports, pastGames, mlModelWeights } = useSelector((state) => state.games)
    const [sportTeams, setSportTeams] = useState()
    const [rankedTeams, setRankedTeams] = useState()
    useEffect(() => {
        let tempTeams = [...teams].filter((team) => team.league === sport)

        setSportTeams(tempTeams)

        if (sportTeams) {

            let tempRankedTeams = sportTeams.sort((a, b) => {
                const getUnderdogGames = (team) => {
                    return pastGames
                        .filter((game) => {

                            let outcome = game.bookmakers?.find((b) => b.key === sportsbook)
                                ?.markets?.find((m) => m.key === 'h2h')
                                ?.outcomes?.find((o) => o.name === team.espnDisplayName);

                            return outcome?.price > 0 || false;
                        });
                };

                let teamAGamesPAD = getUnderdogGames(a);
                let teamBGamesPAD = getUnderdogGames(b);
                let teamAdogWinRate = teamAGamesPAD.length > 0
                    ? teamAGamesPAD.filter((game) => {
                        let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                        return winner == a.espnDisplayName
                    }).length / teamAGamesPAD.length
                    : 0;b

                let teamBdogWinRate = teamBGamesPAD.length > 0
                    ? teamBGamesPAD.filter((game) => {
                        let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                        return winner == b.espnDisplayName
                    }).length / teamBGamesPAD.length
                    : 0;

                return teamBdogWinRate - teamAdogWinRate;
            });

            setRankedTeams(tempRankedTeams)
        }



    }, [teams, pastGames])
    return (
        <div className='flex flex-col'>
            {rankedTeams && rankedTeams.map((team, idx) => {
                let teamGamesPAD = pastGames.filter((game) => {
                    // let predictedWinner = game.predictedWinner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                    // if (predictedWinner !== team.espnDisplayName) return false
                    let outcome = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'h2h')?.outcomes?.find((o) => o.name === team.espnDisplayName)
                    if (outcome?.price > 0) return true
                })

                let teamWinRate = teamGamesPAD.length > 0 ? (teamGamesPAD.filter((game) => {
                    let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                    return winner == team.espnDisplayName
                }).length / teamGamesPAD.length) : 0
                if (idx < 15) {
                    return (
                        <div className='flex flex-row'>
                            <div className='flex flex-row items-center gap-1' style={{ width: '70%' }}>
                                <div style={{ width: '20%' }}>{idx + 1}</div>
                                <div><img style={{ maxWidth: '1.25rem' }} src={team.darkLogo} /></div>
                                <div>{team.abbreviation}</div>
                            </div>
                            <div style={{ width: '30%' }}>
                                <div>{`${(teamWinRate * 100).toFixed(1)}%`}</div>
                            </div>
                        </div>
                    )
                }

            })
            }
        </div>
    );
};

export default DogRankings;