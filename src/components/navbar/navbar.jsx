import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setBankroll, setBetType, setSportsbook, setStarredGames } from '../../redux/slices/userSlice.js';
import { isSameDay, combinedCondition, valueBetConditionCheck } from '../../utils/constants'
import CurvedGauge from "../dataVisComponents/curvedGauge/curvedGauge.jsx";

const NavBar = () => {
    const dispatch = useDispatch()
    const navBarRef = useRef();
    const { games, valueGames, sports, pastGames } = useSelector((state) => state.games);
    const { bankroll, sportsbook, starredGames } = useSelector((state) => state.user);
    const [dimensions, setDimensions] = useState({ width: 60, height: 60 });
    const [dropdownTitle, setDropdownTitle] = useState("Select Sportsbook");
    const [dropdownBG, setDropdownBG] = useState('#527595');
    const [dropdownFont, setDropdownFont] = useState('#eef3f3');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [value, setValue] = useState(0);

    // Set the default sportsbook if props.sportsBook is not provided
    // const sportsbook = sportsBook || 'fanduel'; // Default to 'fanduel' if not passed
    useEffect(() => {
        const updateDimensions = () => {
            if (navBarRef.current) {
                const { width, height } = navBarRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };
        updateDimensions(); // Initial call
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);



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


    useEffect(() => {
        const { bg, font } = setDropdownStyles(sportsbook); // Use sportsbook instead of sportsBook
        setDropdownBG(bg);
        setDropdownFont(font);
        setDropdownTitle(sportsbook); // Update dropdown title with the new sportsbook name
        let gamesFilter = games.filter((game) =>
            (game.timeRemaining || game.complete === true)
            && (game.predictedWinner === 'home'
                ? game.homeScore > game.awayScore
                : game.awayScore > game.homeScore)
            && isSameDay(new Date(), new Date(game.commence_time)))

        let tieFilter = games.filter((game) =>
            game.timeRemaining
            && (game.homeScore === game.awayScore))


        if (gamesFilter.length !== 0 || games.filter((game) => game.timeRemaining).length > 0) {
            setValue((gamesFilter.length + (tieFilter.length * .5)) / (games.filter((game) => game.timeRemaining || (game.complete && isSameDay(new Date(), new Date(game.commence_time)))).length))
        } else {
            setValue(null);
        }
    }, [sportsbook, games, bankroll, valueGames, sports, pastGames]);  // Dependencies for dynamic updates

    return (
        <div

            className="sticky top-0 z-50 py-1 bg-secondary text-white border-b border-secondary flex items-center px-4 justify-between font-bold text-base w-full"
            style={{ width: '100%' }}
        >
            <div className="flex flex-row items-center gap-2"  >
                <Link to={'/'}>
                    <div className='text-text'>BETTOR</div>
                </Link>

                {/* Optional: CurvedGauge */}
                {value !== null &&
                    <div ref={navBarRef}>
                        <CurvedGauge value={value} dimensions={dimensions} />
                    </div>
                }
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
