import { useState, useEffect } from 'react'
import { isSameDay, valueBetConditionCheck, calculateProfitFromImpliedProb, calculateProfitFromUSOdds } from '../../utils/constants.js';
import { setPastGames } from '../../redux/slices/oddsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import LineGraph from '../dataVisComponents/lineGraph/lineGraph.jsx';


const Results = () => {
    const dispatch = useDispatch()
    document.title = 'Results SQL TEST'

    const { sportsbook } = useSelector((state) => state.user);
    const { pastGames, sports } = useSelector((state) => state.games)
    const [valueProfitToday, setValueProfitToday] = useState(0)
    const [profitToday, setProfitToday] = useState(0)
    const [valueProfitThisWeek, setValueProfitThisWeek] = useState(0)
    const [profitThisWeek, setProfitThisWeek] = useState(0)
    const [stake, setStake] = useState(1)

    const today = new Date()
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7); // 30 days ago
    sevenDaysAgo.setHours(0, 0, 0, 0); // Set to midnight 
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15); // 30 days ago
    fifteenDaysAgo.setHours(0, 0, 0, 0); // Set to midnight 
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30); // 30 days ago
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Set to midnight 

    const groupedByDay = [...pastGames].sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)).reduce((acc, game) => {
        // Normalize to YYYY-MM-DD (assumes UTC; adjust if needed)
        const dateKey = new Date(game.commence_time).toLocaleDateString();

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }

        acc[dateKey].unshift(game);
        return acc;
    }, {});

    let winrates = groupedByDay ? Object.keys(groupedByDay).map((day) => {
        const games = groupedByDay[day];
        const totalGames = games.length;
        const wins = games.filter((game) => game.predictionCorrect === true).length;
        return { date: day, value: totalGames > 0 ? (wins / totalGames) * 100 : 0 };
    }) : [];
    let cumulativeProfit = 0;
    let profits = groupedByDay
        ? Object.keys(groupedByDay)
            .map((day) => {
                const games = groupedByDay[day];
                let dailyProfit = 0;
                const filteredGames = games
                for (const game of games) {
                    const bookmaker = game?.bookmakers?.find(b => b.key === sportsbook);
                    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
                    const outcome = market?.outcomes?.find(out =>
                        out.name === (game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName)
                    );

                    if (game.predictionCorrect === true) {
                        dailyProfit += outcome ? calculateProfitFromUSOdds(outcome.price, stake) : 0;
                    } else {
                        dailyProfit -= stake; // you had `-1` before — should match your stake
                    }
                }

                cumulativeProfit += dailyProfit;

                return {
                    date: day,
                    value: cumulativeProfit // now it's the running total
                };
            })
        : [];
    let cumulativeSevenDay = 0
    let sevenDayProfit = groupedByDay
        ? Object.keys(groupedByDay)
            .filter(day => new Date(day) > sevenDaysAgo)
            .map((day) => {
                const games = groupedByDay[day];
                let dailyProfit = 0;
                for (const game of games) {
                    const bookmaker = game?.bookmakers?.find(b => b.key === sportsbook);
                    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
                    const outcome = market?.outcomes?.find(out =>
                        out.name === (game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName)
                    );

                    if (game.predictionCorrect === true) {
                        dailyProfit += outcome ? calculateProfitFromUSOdds(outcome.price, stake) : 0;
                    } else {
                        dailyProfit -= stake; // you had `-1` before — should match your stake
                    }
                }

                cumulativeSevenDay += dailyProfit;

                return {
                    date: day,
                    value: cumulativeSevenDay // now it's the running total
                };

            })
        : [];

    let cumulativefifteenDay = 0
    let fifteenDayProfit = groupedByDay
        ? Object.keys(groupedByDay)
            .filter(day => new Date(day) > fifteenDaysAgo)
            .map((day) => {
                const games = groupedByDay[day];
                let dailyProfit = 0;
                for (const game of games) {
                    const bookmaker = game?.bookmakers?.find(b => b.key === sportsbook);
                    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
                    const outcome = market?.outcomes?.find(out =>
                        out.name === (game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName)
                    );

                    if (game.predictionCorrect === true) {
                        dailyProfit += outcome ? calculateProfitFromUSOdds(outcome.price, stake) : 0;
                    } else {
                        dailyProfit -= stake; // you had `-1` before — should match your stake
                    }
                }

                cumulativefifteenDay += dailyProfit;

                return {
                    date: day,
                    value: cumulativefifteenDay // now it's the running total
                };

            })
        : [];

    let cumulativethirtyDay = 0
    let thirtyDayProfit = groupedByDay
        ? Object.keys(groupedByDay)
            .filter(day => new Date(day) > thirtyDaysAgo)
            .map((day) => {
                const games = groupedByDay[day];
                let dailyProfit = 0;
                for (const game of games) {
                    const bookmaker = game?.bookmakers?.find(b => b.key === sportsbook);
                    const market = bookmaker?.markets?.find(m => m.key === 'h2h');
                    const outcome = market?.outcomes?.find(out =>
                        out.name === (game.predictedWinner === 'home'
                            ? game.homeTeamDetails.espnDisplayName
                            : game.awayTeamDetails.espnDisplayName)
                    );

                    if (game.predictionCorrect === true) {
                        dailyProfit += outcome ? calculateProfitFromUSOdds(outcome.price, stake) : 0;
                    } else {
                        dailyProfit -= stake; // you had `-1` before — should match your stake
                    }
                }

                cumulativethirtyDay += dailyProfit;

                return {
                    date: day,
                    value: cumulativethirtyDay // now it's the running total
                };

            })
        : [];
    return (
        <div className='bg-secondary flex flex-col  m-4 rounded' >
            <div className='flex flex-row justify-evenly items-center flex-wrap my-4'>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div className='width-full'>
                        <h4 className='text-center text-white'>Last 7 Days Win Percentage: {(winrates.filter((game) => new Date(game.date) > sevenDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > sevenDaysAgo).length).toFixed(1)}%</h4>
                    </div>
                    <div className='width-full'>
                        <LineGraph
                            data={winrates.filter((game) => new Date(game.date) > sevenDaysAgo).sort((a, b) => new Date(a.date) - new Date(b.date))} winrates={true}
                        />
                    </div>
                </div>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div className='width-full'>
                        <h4 className='text-center text-white'>Last 15 Days Win Percentage: {(winrates.filter((game) => new Date(game.date) > fifteenDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > fifteenDaysAgo).length).toFixed(1)}%</h4>
                    </div>
                    <div>
                        <LineGraph
                            data={winrates.filter((game) => new Date(game.date) > fifteenDaysAgo).sort((a, b) => new Date(a.date) - new Date(b.date))} winrates={true}
                        />
                    </div>
                </div>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div className='width-full'>
                        <h4 className='text-center text-white'>Last 30 Days Win Percentage: {(winrates.filter((game) => new Date(game.date) > thirtyDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > thirtyDaysAgo).length).toFixed(1)}%</h4>
                    </div>
                    <div>
                        <LineGraph
                            data={winrates.filter((game) => new Date(game.date) > thirtyDaysAgo).sort((a, b) => new Date(a.date) - new Date(b.date))} winrates={true}
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-evenly items-center flex-wrap my-4'>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div>
                        <h4 className='text-center text-white'>Last 7 Days Avg Profit (units): {(sevenDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - sevenDayProfit[idx - 1].value) : game.value), 0) / sevenDayProfit.length).toFixed(1)}</h4>
                    </div>
                    <div className='width-full'>
                        <LineGraph
                            data={sevenDayProfit.sort((a, b) => new Date(a.date) - new Date(b.date))}
                        />
                    </div>
                </div>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div>
                        <h4 className='text-center text-white'>Last 15 Days Avg Profit (units): {(fifteenDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - fifteenDayProfit[idx - 1].value) : game.value), 0) / fifteenDayProfit.length).toFixed(1)}</h4>
                    </div>
                    <div>
                        <LineGraph
                            data={fifteenDayProfit.sort((a, b) => new Date(a.date) - new Date(b.date))}
                        />
                    </div>
                </div>
                <div className=' bg-primary rounded p-2' style={{width: '33%'}}>
                    <div>
                        <h4 className='text-center text-white'>Last 30 Days Avg Profit (units): {(thirtyDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - thirtyDayProfit[idx - 1].value) : game.value), 0) / thirtyDayProfit.length).toFixed(1)}</h4>
                    </div>
                    <div>
                        <LineGraph
                            data={thirtyDayProfit.sort((a, b) => new Date(a.date) - new Date(b.date))}
                        />
                    </div>
                </div>
            </div>

        </div>

        // <Container fluid style={{ backgroundColor: '#121212', margin: '1em 0', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        //     <Card style={{width: '75%', backgroundColor: '#2a2a2a', color: 'white'}}>
        //         <Row>
        //             <Col>
        //                 <Row style={{margin: '1rem 0'}}>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 7 days Win Percentage ${(winrates.filter((game) => new Date(game.date) > sevenDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > sevenDaysAgo).length).toFixed(1) || 0}%`}</Card.Title>
        //                             
        //                         </Card>
        //                     </Col>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 15 days Win Percentage ${(winrates.filter((game) => new Date(game.date) > fifteenDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > fifteenDaysAgo).length).toFixed(1) || 0}%`}</Card.Title>
        //                             
        //                         </Card>
        //                     </Col>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 30 days Win Percentage ${(winrates.filter((game) => new Date(game.date) > thirtyDaysAgo).reduce((acc, game) => acc + game.value, 0) / winrates.filter((game) => new Date(game.date) > thirtyDaysAgo).length).toFixed(1) || 0}%`}</Card.Title>
        //                             
        //                         </Card>
        //                     </Col>
        //                 </Row>
        //                 <Row  style={{margin: '1rem 0'}}>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 7 days Avg Profit (units) ${(sevenDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - sevenDayProfit[idx-1].value) : game.value), 0) / sevenDayProfit.length).toFixed(1) || 0}`}</Card.Title>
        //                             <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
        //                                 <LineGraph
        //                                     data={sevenDayProfit.sort((a, b) => new Date(a.date) - new Date(b.date))}
        //                                 />
        //                             </div>
        //                         </Card>
        //                     </Col>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 7 days Avg Profit (units) ${(fifteenDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - fifteenDayProfit[idx-1].value) : game.value), 0) / fifteenDayProfit.length).toFixed(1) || 0}`}</Card.Title>
        //                             <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
        //                                 
        //                             </div>
        //                         </Card>
        //                     </Col>
        //                     <Col>
        //                         <Card style={{ backgroundColor: '#545454', borderColor: '#575757', color: '#ffffff' }}>
        //                             <Card.Title style={{textAlign: 'center'}}>{`Last 7 days Avg Profit (units) ${(thirtyDayProfit.reduce((acc, game, idx) => acc + (idx > 0 ? (game.value - thirtyDayProfit[idx-1].value) : game.value), 0) / thirtyDayProfit.length).toFixed(1) || 0}`}</Card.Title>
        //                             <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
        //                                 
        //                             </div>
        //                         </Card>
        //                     </Col>
        //                 </Row>
        //             </Col>
        //         </Row>
        //     </Card>

        // </Container>
    )
}

export default Results
