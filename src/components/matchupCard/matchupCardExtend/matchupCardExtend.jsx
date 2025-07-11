import React from 'react';
import MatchupCardExtendStats from './matchupCardExtendStats.jsx';
import MatchupCardExtendBetting from './matchupCardExtendBetting.jsx';
// import MatchupCardExtendRecent from './matchupCardExtendRecent.jsx';

const MatchupCardExtend = ({ expandSection, gameData }) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '.3rem 0', width: '100%'}}>
            { expandSection === 'Stats' && <MatchupCardExtendStats gameData={gameData} /> }
            { expandSection === 'Betting' && <MatchupCardExtendBetting gameData={gameData} /> }
            {/* { expandSection === 'Recent' && <MatchupCardExtendRecent gameData={gameData} /> } */}
        </div>
    );

}

export default MatchupCardExtend;