import { useState, useEffect } from 'react';
import MatchupCard from '../matchupCard/matchupCard.jsx';
import PastGameCard from './pastGameCard.jsx';
import { calculateProfitFromUSOdds, valueBetConditionCheck } from '../../utils/constants.js';
import { useSelector } from 'react-redux';

const PastGamesDisplay = ({ displayGames }) => {
  const { sports } = useSelector((state) => state.games)
  const [open, setOpen] = useState()
  const [valueFilter, setValueFilter] = useState(false);
  const [wins, setWins] = useState()
  const [losses, setLosses] = useState()
  const [profit, setProfit] = useState()
  const [leagueFilter, setLeagueFilter] = useState({
    baseball_mlb: false,
    americanfootball_nfl: false,
    americanfootball_ncaaf: false,
    basketball_nba: false,
    basketball_ncaab: false,
    basketball_wncaab: false,
    icehockey_nhl: false,
  })

  useEffect(() => {
    const selectedLeagues = Object.keys(leagueFilter).filter(
      key => leagueFilter[key]
    );

    const tempWins = displayGames
      .filter(game => game.predictionCorrect === true)
      .filter(game =>
        (!valueFilter || valueBetConditionCheck(sports, game, 'fanduel', 'h2h')) &&
        (selectedLeagues.length === 0 || selectedLeagues.includes(game.sport_key))
      );
    setWins(tempWins);

    const tempLosses = displayGames
      .filter(game => game.predictionCorrect === false)
      .filter(game =>
        (!valueFilter || valueBetConditionCheck(sports, game, 'fanduel', 'h2h')) &&
        (selectedLeagues.length === 0 || selectedLeagues.includes(game.sport_key))
      );
    setLosses(tempLosses);

    let allGames = [...tempWins, ...tempLosses]
    let tempProfit = allGames.filter((game) => {
      if (valueFilter) return valueBetConditionCheck(sports, game, 'fanduel', 'h2h')
      if (selectedLeagues.length > 0) return selectedLeagues.includes(game.sport_key)
      return true
    }).reduce((acc, win) => {
      if (win.predictionCorrect === true) {
        let outcome = win.bookmakers?.find((b) => b.key === 'fanduel')?.markets?.find((m) => m.key === 'h2h')?.outcomes.find((o) => o.name === (win.winner === 'home' ? win.homeTeamDetails.espnDisplayName : win.awayTeamDetails.espnDisplayName))
        if (outcome) return acc += calculateProfitFromUSOdds(outcome.price, 1)
      } else if (win.predictionCorrect === false) {
        return acc -= 1
      }
      return acc
    }, 0)
    setProfit(tempProfit)
  }, [valueFilter, leagueFilter, displayGames])

  const confBrackets = ['50-60', '60-70', '70-80', '80-90', '90-100']
  return (
    <div className="bg-zinc-800 border border-zinc-600 text-white rounded-md">
      <div className='flex flex-row w-full'>
        <div className='flex flex-grow flex-row justify-evenly'>
          {(wins && losses) && <div className='flex'>{`${((wins.length / (wins.length + losses.length)) * 100).toFixed(2)}%`}</div>}
          <div className='flex'>ROI</div>
          {(wins && losses) && <div className='flex'>{`Profit (Units) ${(profit).toFixed(2)}`}</div>}
        </div>
        <div className='flex w-[5%]'>
          <div className="relative inline-block text-left mt-4 text-sm mx-4" >
            <button
              onClick={() => setOpen(!open)}
              className="bg-commonButton text-commonButtonText px-4 py-2 rounded shadow border border-commonButton"
            >
              Filters
            </button>

            {open && (
              <div className="absolute z-10 mt-2 w-64 bg-secondary rounded shadow-lg border border-gray-200 p-4 right-0">
                <div className='flex flex-col'>
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <span>Show only Value Games</span>
                      <input
                        type="checkbox"
                        checked={valueFilter}
                        onChange={() => setValueFilter(!valueFilter)}
                        className="accent-yellow-600"
                      />
                    </label>
                  </div>
                  {sports.map((sport) => {
                    let sportName = sport.name
                    let sportNameSplit = sport.name.split('_')
                    let league = sportNameSplit[sportNameSplit.length - 1]
                    return (
                      <div className="mb-4">
                        <label className="flex items-center space-x-2">
                          <span>{league.toUpperCase()}</span>
                          <input
                            type="checkbox"
                            checked={leagueFilter[sport.name]}
                            onChange={() =>
                              setLeagueFilter(prev => ({
                                ...prev,
                                [sportName]: !prev[sportName]
                              }))
                            }
                            className="accent-yellow-600"
                          />
                        </label>
                      </div>
                    )
                  })}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
      {(wins && losses) && <div className="flex flex-row">
        {/* Wins Column */}
        <div className="flex flex-col border-r" style={{ width: '50%' }}>
          <h3 className="text-center font-semibold mb-2">{`Wins (${wins.length})`}</h3>
          <div className='flex flex-row'>
            {confBrackets.map((bracket) => {
              let bracketSplit = bracket.split('-')
              let bracketStart = bracketSplit[0]
              let bracketEnd = bracketSplit[1]
              return (
                <div className='flex flex-col mx-1 w-[19%]' >
                  <div style={{ textAlign: 'center' }}>
                    {`${bracketStart}% - ${bracketEnd}% (${wins.filter((game) => game.predictionConfidence * 100 > bracketStart && game.predictionConfidence * 100 <= bracketEnd).length})`}
                  </div>
                  <div className='flex flex-col flex-wrap'>
                    {wins.filter((game) => game.predictionConfidence * 100 >= bracketStart && game.predictionConfidence * 100 <= bracketEnd).sort((gameA, gameB) => new Date(gameB.commence_time) - new Date(gameA.commence_time)).map((game) => {
                      return (
                        <PastGameCard game={game} />
                      )
                    })}
                  </div>
                </div>
              )

            })}
          </div>
        </div>

        {/* Losses Column */}
        <div className="flex flex-col border-l" style={{ width: '50%' }}>
          <h3 className="text-center font-semibold mb-2">{`Losses (${losses.length})`}</h3>
          <div className='flex flex-row'>
            {confBrackets.map((bracket) => {
              let bracketSplit = bracket.split('-')
              let bracketStart = bracketSplit[0]
              let bracketEnd = bracketSplit[1]
              return (
                <div className='flex flex-col mx-1 w-[19%]'>
                  <div style={{ textAlign: 'center' }}>
                    {`${bracketStart}% - ${bracketEnd}% (${losses.filter((game) => game.predictionConfidence * 100 > bracketStart && game.predictionConfidence * 100 < bracketEnd).length})`}
                  </div>
                  <div className='flex flex-col flex-wrap'>
                    {losses.filter((game) => game.predictionConfidence * 100 > bracketStart && game.predictionConfidence * 100 < bracketEnd).sort((gameA, gameB) => new Date(gameB.commence_time) - new Date(gameA.commence_time)).map((game) => {
                      return (
                        <PastGameCard game={game} />
                      )
                    })}
                  </div>
                </div>
              )

            })}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default PastGamesDisplay;
