import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import LeadingTeamsCard from './leadingTeamsCard.jsx';
import { calculateProfitFromUSOdds } from '../../utils/constants';

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const LeadingTeams = ({ sortedTeams }) => {
  const { league } = useParams();
  const { pastGames } = useSelector((state) => state.games);
  const { sportsbook } = useSelector((state) => state.user);
  const { teams } = useSelector((state) => state.teams);

  const filteredTeams = teams
    .filter((team) => team.league === league)
    .sort((teamA, teamB) => {
      const getProfit = (team) => {
        const teamGames = pastGames.filter(
          (game) =>
            game.homeTeamDetails.espnDisplayName === team.espnDisplayName ||
            game.awayTeamDetails.espnDisplayName === team.espnDisplayName
        );

        return teamGames.reduce((acc, game) => {
          const bookmaker = game.bookmakers.find((b) => b.key === sportsbook);
          if (bookmaker) {
            const outcome = bookmaker.markets
              .find((m) => m.key === 'h2h')
              ?.outcomes.find(
                (o) =>
                  o.name ===
                  (game.predictedWinner === 'home'
                    ? game.homeTeamDetails.espnDisplayName
                    : game.awayTeamDetails.espnDisplayName)
              );
            if (outcome) {
              return acc + (game.predictionCorrect ? calculateProfitFromUSOdds(outcome.price, 1) : -1);
            }
          }
          return acc;
        }, 0);
      };

      return getProfit(teamB) - getProfit(teamA);
    });

  const topTeams = filteredTeams.slice(0, 50);
  const teamChunks = chunkArray(topTeams, 3);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamChunks.length);
    }, 10*1000); // Rotate every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [teamChunks.length]);

  return (
    <div className="container mx-auto">
      <div className="relative w-full overflow-hidden">
        <div className="transition-all duration-700 ease-in-out">
          {teamChunks.map((teamGroup, idx) => (
            <div
              key={idx}
              className={`absolute top-0 left-0 w-full transition-opacity duration-700 ${
                idx === activeIndex ? 'opacity-100 relative' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex justify-center flex-col gap-2">
                {teamGroup.map((team) => (
                  <div key={team.name} className="w-full">
                    <LeadingTeamsCard
                      sortedTeams={sortedTeams.filter((t) => t.league === league)}
                      team={team}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadingTeams;
