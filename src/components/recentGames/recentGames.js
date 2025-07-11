import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { isSameDay } from '../../utils/constants';

const RecentGames = ({team}) => {
    const { pastGames } = useSelector((state) => state.games)
    const { teams } = useSelector((state) => state.teams)
    const teamData = teams.find((t) => t.espnDisplayName === team);
    console.log(team)
    const formatGameTime = (time) => {
        const gameTime = new Date(time);
        return isSameDay(time, new Date())
          ? gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit',hour12: true });
    };



    let games = pastGames
    .filter((game) => (game.awayTeamDetails.espnDisplayName === team || game.homeTeamDetails.espnDisplayName === team) && (game.awayTeamIndex !== game.homeTeamIndex))
    .sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time));

    return (
        <Table bordered variant='dark'>
        <thead>
            <tr>
                <th style={{fontSize: '1rem'}}>Matchup</th>
                <th style={{fontSize: '1rem'}}>W/L</th>
                <th style={{fontSize: '1rem'}}>BBI Δ</th>
                <th style={{fontSize: '1rem'}}>✓/X</th>
            </tr>
        </thead>
        <tbody>
            {            
            games.map((game , idx) => {
                if(idx < 5){
                    if(game.homeTeamDetails.espnDisplayName === team){
                        return (
                            <tr key={game.id}>
                            <td style={{fontSize: '.7rem'}}>{`${formatGameTime(game.commence_time)}`} vs <img style={{width: '1.4rem'}} src={game.awayTeamDetails.darkLogo} alt={`${game.awayTeamDetails.espnDisplayName} logo`} /></td>
                            {game.winner === 'home'? <td style={{fontSize: '.7rem', backgroundColor: 'rgba(0, 255, 0, .2)', textAlign: 'center'}}>W</td> : <td style={{fontSize: '.7rem', backgroundColor: 'rgba(255, 0, 0, .2)', textAlign: 'center'}}>L</td>}
                            <td style={{fontSize: '.7rem', textAlign: 'center'}}>{(game.homeTeamScaledIndex - game.awayTeamScaledIndex).toFixed(2)}</td>
                            {game.predictionCorrect ? <td style={{fontSize: '.7rem', backgroundColor: 'rgba(0, 255, 0, .2)', textAlign: 'center'}}>✓</td> : <td style={{fontSize: '.7rem', backgroundColor: 'rgba(255, 0, 0, .2)', textAlign: 'center'}}>X</td> }
                        </tr>
                        )
                    }else if(game.awayTeamDetails.espnDisplayName === team){
                        return (
                            <tr key={game.id}>
                            <td style={{fontSize: '.7rem'}}>{`${formatGameTime(game.commence_time)}`} vs <img style={{width: '1.4rem'}} src={game.homeTeamDetails.darkLogo} alt={`${game.homeTeamDetails.espnDisplayName} logo`} /></td>
                            {game.winner === 'away'? <td style={{fontSize: '.7rem', backgroundColor: 'rgba(0, 255, 0, .2)', textAlign: 'center'}}>W</td> : <td style={{fontSize: '.7rem', backgroundColor: 'rgba(255, 0, 0, .2)', textAlign: 'center'}}>L</td>}
                            <td style={{fontSize: '.7rem', textAlign: 'center'}}>{(game.awayTeamScaledIndex - game.homeTeamScaledIndex).toFixed(2)}</td>
                            {game.predictionCorrect ? <td style={{fontSize: '.7rem', backgroundColor: 'rgba(0, 255, 0, .2)', textAlign: 'center'}}>✓</td> : <td style={{fontSize: '.7rem', backgroundColor: 'rgba(255, 0, 0, .2)', textAlign: 'center'}}>X</td> }
                        </tr>
                        )
                    }
                }
                return null
        })}
        </tbody>
    </Table>
    );
};

export default RecentGames;
