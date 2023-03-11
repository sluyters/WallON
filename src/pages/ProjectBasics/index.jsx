import React, { useEffect, useRef, useMemo, useState }  from 'react';
import GestureHandler from 'quantumleapjs';
import { Impress, Step } from '../../libs/react_impress/components';

export default function ProjectBasics({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);

  const ref = useRef();

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldown)
      return;

    switch(event.gesture.name) {
      case "rhand_lswipe":
        console.log('Swipe left!');
        ref.current.next();
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

  return (
  <div>
    <Impress fallbackMessage="Oops" ref={ref}>
      <Step id="intro1" data={
        {
          x: 0,
          y: 0
        }
      }>
        <h1>Marre des travaux?</h1>
      </Step>
      <Step id="intro2" data={{
        x: 1000,
        y: -200,
        rotate: -90
      }}>
        <h1>Nous avons la solution!</h1>
      </Step>
      <Step id="intro3" data={
        {
          x: 2000,
          y: 0,
          rotate: -90,
          scale: 3
        }
      }>
        <h1>Et ça va swinguer!</h1>
      </Step>
    </Impress>
  </div>
  );
}