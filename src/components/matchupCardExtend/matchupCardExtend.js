import React from 'react';
import MatchupCardExtendStats from './matchupCardExtendStats';
import MatchupCardExtendBetting from './matchupCardExtendBetting';
import MatchupCardExtendRecent from './matchupCardExtendRecent';

const MatchupCardExtend = ({ expandSection, gameData }) => {
    return (
        <div>
            { expandSection === 'Stats' && <MatchupCardExtendStats gameData={gameData} /> }
            { expandSection === 'Betting' && <MatchupCardExtendBetting gameData={gameData} /> }
            { expandSection === 'Recent' && <MatchupCardExtendRecent gameData={gameData} /> }
        </div>
    );

}

export default MatchupCardExtend;