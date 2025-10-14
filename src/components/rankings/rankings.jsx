import React from 'react';
import { useSelector } from 'react-redux';
import { hexToRgb, getLuminance } from '../../utils/constants';
import TeamRankings from './teamRanking';

const Rankings = () => {
    const { sports } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);

    function getVisibleTeams(teams, averageIndex) {
        const sorted = [...teams].sort((a, b) => b.statIndex - a.statIndex);
        const topTeams = sorted.slice(0, 10);
        const bottomTeams = sorted.slice(-10);

        const teamsNearAverage = sorted
            .map((team) => ({
                ...team,
                distanceFromAvg: Math.abs(team.statIndex - averageIndex),
            }))
            .sort((a, b) => a.distanceFromAvg - b.distanceFromAvg)
            .slice(0, 15);

        const seen = new Set();
        const visible = [...topTeams, ...bottomTeams, ...teamsNearAverage].filter(team => {
            if (seen.has(team.id)) return false;
            seen.add(team.id);
            return true;
        });

        return visible.sort((a, b) => b.statIndex - a.statIndex);
    }

    function getVisibleTeamsEvenBuckets(teams, teamsPerBucket = 3) {
        const sorted = [...teams].sort((a, b) => b.statIndex - a.statIndex);
        const bucketSize = Math.ceil(sorted.length / 10);
        const result = [];

        for (let i = 0; i < 10; i++) {
            const bucket = sorted.slice(i * bucketSize, (i + 1) * bucketSize);
            result.push(...bucket.slice(0, teamsPerBucket));
        }

        const seen = new Set();
        return result.filter(team => {
            if (seen.has(team.id)) return false;
            seen.add(team.id);
            return true;
        }).sort((a, b) => b.statIndex - a.statIndex);
    }

    return (
        <div className="relative top-12 bg-[#121212] min-h-screen px-4 py-6">
            <title>Rankings</title>
            <div className="flex flex-wrap justify-evenly gap-2">
                {[...sports]
                    .sort((a, b) => {
                        const teamsA = teams.filter(team => team.league === a.name).length;
                        const teamsB = teams.filter(team => team.league === b.name).length;
                        return teamsA - teamsB;
                    })
                    .map((sport) => {
                        let sortedTeams = teams.filter((team) => team.league === sport.name).sort((teamA, teamB) => teamB.statIndex - teamA.statIndex)
                        return (
                            <div style={{width: `${sport.league.includes('college') ? 21: 21}%`}}>
                                <TeamRankings sport={sport.name} sortedTeams={sortedTeams} />
                            </div>

                        )

                    })}
            </div>
        </div>
    );
};

export default Rankings;
