import {
  getDifferenceInMinutes,
  formatMinutesToHoursAndMinutes,
  getLuminance,
  hexToRgb,
  valueBetConditionCheck,
} from "../../utils/constants.js";
import MatchupCard from "../matchupCard/matchupCard.jsx";
import { useSelector } from "react-redux";
import UpcomingGameMini from "../landingPage/upcomingGames/upcomingGameMini/upcomingGameMini.jsx";
import { useMemo, useState } from "react";
import LiveGameCard from "./liveGameCard/liveGameCard.jsx";

const LiveView = () => {
  const { games, sports } = useSelector((state) => state.games);
  const { sportsbook } = useSelector((state) => state.user);
  const [filterbySport, setFilterBySport] = useState(false);

  // ------------------------------------
  // 🕒 Derived constants
  // ------------------------------------
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const startOfnewModel = useMemo(() => {
    const d = new Date(2025, 10, 10);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ------------------------------------
  // 📊 Derived stats (unchanged from yours)
  // ------------------------------------

  

  // ------------------------------------
  // 🧮 Filtered live and upcoming games
  // ------------------------------------
  const upcomingGames = games
    .filter((game) => {
      const diff = getDifferenceInMinutes(
        new Date(),
        new Date(game.commence_time)
      );
      return !game.timeRemaining && diff < 360 && diff > 0;
    })
    .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

  const liveGames = games
    .filter((game) => game.timeRemaining)
    .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

  // ------------------------------------
  // 🧱 RENDER
  // ------------------------------------
  return (
    <div className="flex flex-col items-center w-full">
      <title>Live Dashboard</title>

      <div className="w-full mx-auto">
        {/* ------------------------- */}
        {/* 🔸 UPCOMING GAMES STRIP */}
        {/* ------------------------- */}
        {upcomingGames.length > 0 && (
          <section className="bg-secondary my-4 rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-semibold">Starting Soon</h4>
              <span className="text-gray-400 text-xs">
                {`${upcomingGames.length} games in next 6h`}
              </span>
            </div>
            <div className="flex flex-row overflow-x-auto gap-3 pb-2" style={{ scrollbarWidth: 'thin' }}>
              {upcomingGames.map((game, idx) => (
                <UpcomingGameMini
                  key={idx}
                  gameData={game}
                  timeUntilStart={formatMinutesToHoursAndMinutes(
                    getDifferenceInMinutes(
                      new Date(),
                      new Date(game.commence_time)
                    ).toFixed(0)
                  )}
                  isValueBet={valueBetConditionCheck(
                    sports,
                    game,
                    sportsbook,
                    "h2h",
                    game.predictedWinner
                  )}
                />
              ))}
            </div>
          </section>
        )}

        {/* ------------------------- */}
        {/* 🔹 LIVE GAMES GRID */}
        {/* ------------------------- */}
        <section className="bg-secondary rounded-md p-3 my-4  ">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-semibold">Live Games</h4>
            <label className="text-gray-300 text-sm flex items-center">
              <input
                type="checkbox"
                checked={filterbySport}
                onChange={() => setFilterBySport(!filterbySport)}
                className="mr-2 accent-yellow-400"
              />
              Filter by Sport
            </label>
          </div>

          {!filterbySport ? (
            <div className="flex flex-wrap justify-center gap-3 overflow-y-scroll max-h-[42rem]"  style={{ scrollbarWidth: 'thin' }}>
              {liveGames.map((game, idx) => (
                <LiveGameCard key={idx} gameData={game} />
              ))}
            </div>
          ) : (
            sports
              .filter(
                (sport) =>
                  games.filter(
                    (game) => game.sport_key === sport.name && game.timeRemaining
                  ).length > 0
              )
              .map((sport) => {
                const sportKey = sport.name.split("_")[1].toUpperCase();
                const sportGames = games.filter(
                  (game) => game.sport_key === sport.name && game.timeRemaining
                );
                return (
                  <div key={sport.key} className="mb-4">
                    <h5 className="text-center text-white mb-2 font-medium">
                      {sportKey}
                    </h5>
                    <div className="flex flex-wrap justify-center gap-3">
                      {sportGames.map((game, idx) => (
                        <LiveGameCard key={idx} gameData={game} />
                      ))}
                    </div>
                  </div>
                );
              })
          )}
        </section>

      </div>
    </div>
  );
};

export default LiveView;
