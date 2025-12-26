import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { getDifferenceInMinutes, formatMinutesToHoursAndMinutes, hexToRgb, getLuminance } from '../../../utils/constants';
import MatchupCard from '../../matchupCard/matchupCard';
import UpcomingGameMini from '../upcomingGames/upcomingGameMini/upcomingGameMini';
import LiveGameCard from '../../live/liveGameCard/liveGameCard';
import LiveView from '../../live/liveView';

const LandingPageLive = () => {
    // Example redux state variables
    const { games, pastGames } = useSelector((state) => state.games);
    const { teams } = useSelector((state) => state.teams);

    // useEffect(() => {
    //     // Example effect
    // }, []);

    return (
        <div className='w-full flex flex-col bg-secondary rounded'>
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
            <LiveView />

        </div>
    );
};

export default LandingPageLive;