// hooks/useResizeObserver.js
import { useEffect, useRef, useState } from 'react';

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions(entry.contentRect);
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;
