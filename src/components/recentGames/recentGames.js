import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { isSameDay } from '../../utils/constants';

const RecentGames = ({team}) => {
    const { pastGames } = useSelector((state) => state.games)

    const formatGameTime = (time) => {
        const gameTime = new Date(time);
        return isSameDay(time, new Date())
          ? gameTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          : gameTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour12: true });
    };



    let games = pastGames
    .filter((game) => (game.away_team === team || game.home_team === team) && (game.awayTeamIndex != game.homeTeamIndex))
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
                    if(game.home_team === team){
                        return (
                            <tr key={game.id}>
                            <td style={{fontSize: '.8rem'}}>{`${formatGameTime(game.commence_time)}`} vs <img style={{width: '1.4rem'}} src={game.awayTeamlogo} /> {`${game.awayTeamAbbr}`}</td>
                            {game.winner === 'home'? <td style={{fontSize: '.8rem', backgroundColor: 'rgba(0, 255, 0, .2)'}}>W</td> : <td style={{fontSize: '.8rem', backgroundColor: 'rgba(255, 0, 0, .2)'}}>L</td>}
                            <td style={{fontSize: '.8rem'}}>{(game.homeTeamIndex - game.awayTeamIndex).toFixed(2)}</td>
                            {game.predictionCorrect ? <td style={{fontSize: '.8rem', backgroundColor: 'rgba(0, 255, 0, .2)'}}>✓</td> : <td style={{fontSize: '.8rem', backgroundColor: 'rgba(255, 0, 0, .2)'}}>X</td> }
                        </tr>
                        )
                    }else if(game.away_team === team){
                        return (
                            <tr key={game.id}>
                            <td style={{fontSize: '.8rem'}}>{`${formatGameTime(game.commence_time)}`} vs <img style={{width: '1.4rem'}} src={game.homeTeamlogo} /> {`${game.homeTeamAbbr}`}</td>
                            {game.winner === 'away'? <td style={{fontSize: '.8rem', backgroundColor: 'rgba(0, 255, 0, .2)'}}>W</td> : <td style={{fontSize: '.8rem', backgroundColor: 'rgba(255, 0, 0, .2)'}}>L</td>}
                            <td style={{fontSize: '.8rem'}}>{(game.awayTeamIndex - game.homeTeamIndex).toFixed(2)}</td>
                            {game.predictionCorrect ? <td style={{fontSize: '.8rem', backgroundColor: 'rgba(0, 255, 0, .2)'}}>✓</td> : <td style={{fontSize: '.8rem', backgroundColor: 'rgba(255, 0, 0, .2)'}}>X</td> }
                        </tr>
                        )
                    }
                }
        })}
        </tbody>
    </Table>
    );
};

export default RecentGames;
