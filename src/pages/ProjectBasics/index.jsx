import React, { useEffect, useRef, useMemo, useState }  from 'react';
import GestureHandler from 'quantumleapjs';
import { Impress, Step } from '../../libs/react_impress/components';
import './index.css';

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

  // methodes: 
  return (
  <div>
    <Impress fallbackMessage="Oops" ref={ref}>
      <Step id="pre-slide" data={{
        x: 0,
        y: 0
      }}>
        <h1>Starting slide</h1>
      </Step>
      <Step id="vision" data={
        {
          x: 1000,
          y: 0
        }
      }>
        <div class="mydivsize" style={{backgroundImage: "url(/images/gare_vision_future.png)"}}>
          <h1>Notre futur</h1>
          <h2>Cadre vert</h2>
          <p>La nature au coeur du centre-ville</p>
          <h2>Mobilité</h2>
          <p>Modes de transport doux & en commun</p>
          <h2>Accessibilité pour tous</h2>
        </div>
      </Step>
      <Step id="carte-1" data={{
        x: 2000,
        y: 0,
        rotate: -180
      }}>
        <div class="mydivsize" style={{backgroundImage: "url(/images/plan_court_terme.png)"}}>
          <h1>Par qui?</h1>
          <p>SNCB, IGRETEC, Ville de Charleroi</p>
        </div>
      </Step>
      <Step id="carte-2" data={{
        x: 2500,
        y: 0,
        rotate: -360
      }}>
        <div class="mydivsize" style={{backgroundImage: "url(/images/plan_moyen_terme.png)"}}>
          <h1>Jusque quand?</h1>
          <p>Décembre 2023</p>
        </div>
      </Step>
      <Step id="carte-3" data={{
        x: 3000,
        y: 0,
        rotate: -540
      }}>
        <div class="mydivsize" style={{backgroundImage: "url(/images/plan_long_terme.png)"}}>
          <h1>A quel coût?</h1>
          <p>€ 25 millions</p>
        </div>
      </Step>
      <Step id="concluuuuusion" data={
        {
          x: 0,
          y: 1000,
          scale: 3
        }
      }>
        <div>
          <h1>Plus qu'un projet, notre mission</h1>
          <ul>
            <li>Une ville inclusive</li>
            <li>Une ville durable</li>
            <li>Des services publics performants</li>
          </ul>
        </div>
      </Step>
    </Impress>
  </div>
  );
}