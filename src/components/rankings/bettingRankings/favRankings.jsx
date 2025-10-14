import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';

const FavRankings = ({ sport }) => {
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
                const getFavoriteGames = (team) => {
                    return pastGames
                        .filter((game) => {

                            let outcome = game.bookmakers?.find((b) => b.key === sportsbook)
                                ?.markets?.find((m) => m.key === 'h2h')
                                ?.outcomes?.find((o) => o.name === team.espnDisplayName);

                            return outcome?.price < 0 || false;
                        });
                };

                let teamAGamesPAF = getFavoriteGames(a);
                let teamBGamesPAF = getFavoriteGames(b);
                let teamAfavWinRate = teamAGamesPAF.length > 0
                    ? teamAGamesPAF.filter((game) => {
                        let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                        return winner == a.espnDisplayName
                    }).length / teamAGamesPAF.length
                    : 0;

                let teamBfavWinRate = teamBGamesPAF.length > 0
                    ? teamBGamesPAF.filter((game) => {
                        let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                        return winner == b.espnDisplayName
                    }).length / teamBGamesPAF.length
                    : 0;
                return teamBfavWinRate - teamAfavWinRate;
            });

            setRankedTeams(tempRankedTeams)
        }



    }, [teams, pastGames])
    return (
        <div className='flex flex-col px-1'>
            {rankedTeams && rankedTeams.map((team, idx) => {
                let teamGamesFAV = pastGames.filter((game) => {
                    let outcome = game.bookmakers?.find((b) => b.key === sportsbook)?.markets?.find((m) => m.key === 'h2h')?.outcomes?.find((o) => o.name === team.espnDisplayName)
                    if (outcome?.price < 0) return true
                })
                let teamWinRate = teamGamesFAV.length > 0 ? (teamGamesFAV.filter((game) => {
                    let winner = game.winner === 'home' ? game.homeTeamDetails.espnDisplayName : game.awayTeamDetails.espnDisplayName
                    return winner == team.espnDisplayName
                }).length / teamGamesFAV.length) : 0
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

export default FavRankings;