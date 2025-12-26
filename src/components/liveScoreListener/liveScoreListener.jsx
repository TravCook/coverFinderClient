import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGamesEmit } from '../../redux/slices/oddsSlice';

function LiveScoreListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const evtSource = new EventSource(`http://${import.meta.env.VITE_REACT_APP_API_URL}/liveUpdates`);

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const cleanData = structuredClone(data); // safest if available
        dispatch(setGamesEmit([...cleanData.odds, ...cleanData.pastGames]))
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [dispatch]);

  return null; // this component doesn’t render anything
}

export default LiveScoreListener;
