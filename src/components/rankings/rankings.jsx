import React from 'react';
import { useSelector } from 'react-redux';
import { hexToRgb, getLuminance } from '../../utils/constants';

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
            <div className="flex flex-wrap justify-around gap-4">
                {[...sports]
                    .sort((a, b) => {
                        const teamsA = teams.filter(team => team.league === a.name).length;
                        const teamsB = teams.filter(team => team.league === b.name).length;
                        return teamsA - teamsB;
                    })
                    .map((sport) => {
                        const sportTeams = teams.filter(team => team.league === sport.name);
                        const sortedTeams = [...sportTeams].sort((a, b) => b.statIndex - a.statIndex);
                        const averageIndex = sortedTeams.reduce((acc, team) => acc + team.statIndex, 0) / sortedTeams.length;
                        const league = sport.name.split('_')[1]?.toUpperCase() || sport.name;

                        return (
                            <div
                                key={sport.name}
                                className={`bg-primary border border-primary text-white p-4 rounded-lg overflow-y-scroll scrollbar-thin max-h-[90vh] ${
                                    sport.name.includes('college') ? 'w-[26%]' : 'w-[20%]'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">{league}</span>
                                    <button className="text-sm font-semibold bg-yellow-600 text-[#121212] px-3 py-1 rounded">
                                        Details
                                    </button>
                                </div>

                                <div className="space-y-.5">
                                    {sortedTeams.map((team, idx) => {
                                        const prev = sortedTeams[idx - 1];
                                        const isCrossingAvg =
                                            idx > 0 &&
                                            ((prev.statIndex >= averageIndex && team.statIndex < averageIndex) ||
                                            (prev.statIndex < averageIndex && team.statIndex >= averageIndex));

                                        const [r, g, b] = hexToRgb('#545454');
                                        const luminance = getLuminance(r, g, b);
                                        const logo = luminance < 0.5 ? team.lightLogo : team.darkLogo;

                                        return (
                                            <div key={team.id}>
                                                {isCrossingAvg && <div className="border-t-2 border-gray-400 my-2" />}
                                                <div className="flex flex-row">
                                                    <div style={{width: '10%'}} >{idx + 1}.</div>
                                                    <div style={{width: '70%'}} className='flex flex-row items-center'>
                                                        <img src={logo} alt="team logo" className="w-5 h-5" />
                                                        <span >
                                                            {team.school
                                                                ? `${team.abbreviation} ${team.teamName}`
                                                                : team.espnDisplayName}
                                                        </span>
                                                    </div>
                                                    <div style={{width: '20%', textAlign: 'right'}}>
                                                        {`${(((team.statIndex - averageIndex) / averageIndex) * 100).toFixed(1)}%`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Rankings;
