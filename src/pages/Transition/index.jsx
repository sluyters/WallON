import React, { useEffect, useRef, useMemo, useState }  from 'react';
import GestureHandler from 'quantumleapjs';

export default function Transition({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldown)
      return;

    switch(event.gesture.name) {
      case "rhand_lswipe":
        console.log('Swipe left!');
        break;
      case "rhand_rswipe":
        console.log('Swipe right!');
        break;
      default:
        console.error(`Unknown gesture: ${event.gesture.name}`);
        return;
    }

    setGestureCooldown(true);
    gestureCooldownTimeoutRef.current = setTimeout(_ => {
      setGestureCooldown(false);
    }, 2000);
  });

  // Runs only when component is mounted
  useEffect(() => {
    gestureHandlerRef.current = new GestureHandler();
    gestureHandlerRef.current.registerGestures('dynamic', ['rhand_lswipe', 'rhand_rswipe']);
    gestureHandlerRef.current.addEventListener('gesture', gestureEventListener);
    gestureHandlerRef.current.connect();
    // Runs when component unmounts
    return () => {
      setGestureCooldown(false);
      clearTimeout(gestureCooldownTimeoutRef);
      gestureHandlerRef.current.removeEventListeners();
      gestureHandlerRef.current.disconnect();
    }
  }, []);

  return <div> Transition </div>;
}