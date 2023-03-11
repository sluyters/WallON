import React, { useEffect, useRef, useMemo, useState }  from 'react';
import GestureHandler from 'quantumleapjs';
import { Impress, Step } from '../../libs/react_impress/components';
import demo from '../../libs/react_impress/demo/impress-demo'

export default function ProjectDetails({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);

  const mainPres = useRef();

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldown)
      return;

    switch(event.gesture.name) {
      case "rhand_lswipe":
        console.log('Swipe left!');
        mainPres.current.next();
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

  return <div> ProjectDetails </div>;
}