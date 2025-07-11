import MatchupCard from '../matchupCard/matchupCard.jsx';

const PastGamesDisplay = ({ displayGames }) => {
  const wins = displayGames.filter((game) => game.predictionCorrect === true);
  const losses = displayGames.filter((game) => game.predictionCorrect === false);

  return (
    <div className="bg-zinc-800 border border-zinc-600 text-white rounded-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Wins Column */}
        <div className="w-full md:w-1/2">
          <h3 className="text-center font-semibold mb-2">{`Wins (${wins.length})`}</h3>
          <div className="h-[20rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent pr-2">
            <div className="flex flex-wrap gap-4 justify-center">
              {wins.map((game, idx) => (
                <div key={idx} className="w-full md:w-[48%] xl:w-[30%]">
                  <MatchupCard gameData={game} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Losses Column */}
        <div className="w-full md:w-1/2">
          <h3 className="text-center font-semibold mb-2">{`Losses (${losses.length})`}</h3>
          <div className="h-[20rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent pr-2">
            <div className="flex flex-wrap gap-4 justify-center">
              {losses.map((game, idx) => (
                <div key={idx} className="w-full md:w-[48%] xl:w-[30%]">
                  <MatchupCard gameData={game} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastGamesDisplay;
