import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import MatchupCard from '../../matchupCard/matchupCard';

const LandingPageLive = () => {
    // Example redux state variables
    const { games, pastGames } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);

    // useEffect(() => {
    //     // Example effect
    // }, []);

    return (
        <div style={{ width: '97%' }} className='flex flex-col bg-secondary rounded'>
            <div className='flex flex-col md:flex-row justify-between' style={{ padding: '.5em', borderBottom: '1px solid #575757' }}>
                <div>{`LIVE NOW`}</div>
                <div className='flex'>
                    <Link to={`/live`}>
                        <button id={'live'} className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton">
                            More
                        </button>
                    </Link>
                </div>
            </div>
            <div className='flex flex-row flex-wrap justify-center gap-2'>
                {games.filter((game) => game.timeRemaining).map((game) => {
                    return (
                        <div>
                            <MatchupCard gameData={game} />
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default LandingPageLive;