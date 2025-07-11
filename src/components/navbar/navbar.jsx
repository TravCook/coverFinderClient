import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setBankroll, setBetType, setSportsbook, setStarredGames } from '../../redux/slices/userSlice.js';
import { isSameDay, combinedCondition, valueBetConditionCheck } from '../../utils/constants'
import CurvedGauge from "../dataVisComponents/curvedGauge/curvedGauge.jsx";

const NavBar = () => {
    const dispatch = useDispatch()
    const navBarRef = useRef();
    const { games, valueGames, sports, pastGames } = useSelector((state) => state.games);
    const { bankroll, sportsbook, starredGames } = useSelector((state) => state.user);
    const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });
    const [dropdownTitle, setDropdownTitle] = useState("Select Sportsbook");
    const [dropdownBG, setDropdownBG] = useState('#527595');
    const [dropdownFont, setDropdownFont] = useState('#eef3f3');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [value, setValue] = useState(0);

    // Set the default sportsbook if props.sportsBook is not provided
    // const sportsbook = sportsBook || 'fanduel'; // Default to 'fanduel' if not passed
    useEffect(() => {
        if (navBarRef.current) {
            const { width, height } = navBarRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, [navBarRef.current]);

    const handleDropDownClick = (event) => {
        dispatch(setSportsbook(event.target.id));
        setDropdownTitle(event.target.textContent);
    };

    const handleSubmit = (event) => {
        dispatch(setBankroll(event.target.value));
    };

    const handleFormChange = (event) => {
        let id = event.target.id
        let betTypeSplit = id.split(" ")
        dispatch(setBetType(betTypeSplit[0]))
    }

    const handleModalClose = () => setShowModal(false); // Close modal
    const handleModalShow = () => setShowModal(true); // Show modal

    const setDropdownStyles = (sportsbook) => {
        const colors = {
            draftkings: { bg: '#61b510', font: '#eef3f3' },
            betmgm: { bg: '#dbc172', font: '#2b3143' },
            fanduel: { bg: '#0070eb', font: '#eef3f3' },
            williamhill_us: { bg: '#223c2e', font: '#eef3f3' },
            betrivers: { bg: '#1a365d', font: '#eef3f3' },
            unibet_us: { bg: '#147b45', font: '#eef3f3' },
            betonlineag: { bg: '#2d2e2c', font: '#eef3f3' },
            lowvig: { bg: '#01153d', font: '#eef3f3' },
            mybookieag: { bg: '#ff8300', font: '#eef3f3' },
            wynnbet: { bg: '#ff8300', font: '#eef3f3' },
            bovada: { bg: '#cc0000', font: '#eef3f3' },
            betus: { bg: '#223e71', font: '#eef3f3' },
            superbook: { bg: '#e5b724', font: '#eef3f3' },
            pointsbetus: { bg: '#ed1b42', font: '#eef3f3' }
        };
        return colors[sportsbook] || { bg: '#527595', font: '#eef3f3' };
    };


    // const handleAutoStar = () => {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);  // Set time to midnight

    //     const tomorrow = new Date();
    //     tomorrow.setDate(tomorrow.getDate() + 2);
    //     tomorrow.setHours(0, 0, 0, 0);  // Set time to midnight

    //     let updatedStarredGames = [...starredGames];
    //     games.filter((game) => {
    //         const bookmaker = game.bookmakers.find(bookmaker => bookmaker.key === sportsbook);
    //         if (bookmaker) {
    //             const marketData = bookmaker?.markets?.find(m => m.key === 'h2h');

    //             let outcome = marketData?.outcomes?.find(o => {
    //                 return o.name === (game.predictedWinner === 'home' ? game.home_team : game.away_team)
    //             });

    //             if (outcome) {
    //                 let currentSport = sports.find(arraySport => arraySport.name === game.sport_key)
    //                 let sportSettings = currentSport.valueBetSettings.find((setting) => setting.bookmaker === sportsbook)
    //                 if (sportSettings !== undefined) {
    //                     let valueBetCheck = combinedCondition(game, outcome, sportSettings.settings.indexDiffSmallNum, sportSettings.settings.indexDiffRangeNum, sportSettings.settings.confidenceLowNum, sportSettings.settings.confidenceRangeNum)
    //                     if (valueBetCheck) {
    //                         return game
    //                     }
    //                 }

    //             }


    //         }
    //         return false;
    //     }).filter((game) => isSameDay(new Date(game.commence_time), today)).map((gameData) => {
    //         // Check if the game is already starred
    //         if (!starredGames.some((game) => game.id === gameData.id)) {
    //             // If not, create a new array with the new starred game
    //             updatedStarredGames.push(gameData)

    //             // Save the updated starred games to cookies
    //             localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));

    //             dispatch(setStarredGames(updatedStarredGames)); // Dispatch the updated array

    //         }
    //         return null
    //     })
    //     starredGames.map((gameData) => {
    //         if (!valueBetConditionCheck(sports, gameData, sportsbook, pastGames)) {
    //             updatedStarredGames = starredGames.filter((filterGame) => filterGame.id !== gameData.id);
    //             localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
    //             dispatch(setStarredGames(updatedStarredGames)); // Dispatch the filtered array

    //         }
    //         return null
    //     })



    // }

    useEffect(() => {
        const { bg, font } = setDropdownStyles(sportsbook); // Use sportsbook instead of sportsBook
        setDropdownBG(bg);
        setDropdownFont(font);
        setDropdownTitle(sportsbook); // Update dropdown title with the new sportsbook name
        let gamesFilter = games.filter((game) =>
            game.timeRemaining
            && (game.predictedWinner === 'home'
                ? game.homeScore > game.awayScore
                : game.awayScore > game.homeScore))

        let tieFilter = games.filter((game) =>
            game.timeRemaining
            && (game.homeScore === game.awayScore))

        let pastGamesFilter = pastGames.filter((game) =>
            isSameDay(new Date(), new Date(game.commence_time))
            && (game.predictionCorrect))


        if (gamesFilter.length !== 0 || pastGamesFilter.length !== 0 || games.filter((game) => game.timeRemaining).length > 0) {
            setValue((gamesFilter.length + pastGamesFilter.length + (tieFilter.length * .5)) / (games.filter((game) => game.timeRemaining).length + pastGames.filter((game) => isSameDay(new Date(), new Date(game.commence_time))).length))
        } else {
            setValue(0);
        }
    }, [sportsbook, games, bankroll, valueGames, sports, pastGames]);  // Dependencies for dynamic updates

    return (
        <div
            
            className="
    sticky top-0 z-50 w-full h-12 bg-secondary text-white
    border-b border-secondary flex items-center justify-between px-4 font-bold text-base
  "
        >
            <div className="flex items-center space-x-4" ref={navBarRef}>
                <div>BETTOR</div>
                {/* Optional: CurvedGauge */}
                {value > 0 && <div className="w-16 h-8">
                    <CurvedGauge value={value} dimensions={dimensions} />
                </div>}
            </div>

            <div className="flex items-center space-x-2">
                {/* Options Button */}
                <button
                    className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton"
                    onClick={handleModalShow}
                >
                    Options
                </button>

                {/* Login Button */}
                <button
                    className="text-sm px-4 py-1 rounded bg-commonButton text-commonButtonText border border-commonButton"
                >
                    Log In
                </button>
            </div>
        </div>

    );
};

export default NavBar;
