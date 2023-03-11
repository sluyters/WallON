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
    <Impress fallbackMessage="Oops" hint="false" ref={ref}>
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
        <div class="basics vision-future" style={{backgroundImage: "url(/images/gare_vision_future.png)", backgroundPosition: "center"}}>
          <h1><span>Notre futur</span></h1>
          <h2><span>Cadre vert</span></h2>
          <p><span>La nature au coeur du centre-ville</span></p>
          <h2><span>Mobilité</span></h2>
          <p><span>Modes de transport doux & en commun</span></p>
          <h2><span>Accessibilité pour tous</span></h2>
        </div>
      </Step>
      {/*
      We use a single step for this view, because the card should be located at the same place in all 3
      */}
      <Step id="cartes-1" data={{
        x: 2000,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>Par qui?</h1>
          <p>SNCB, IGRETEC, Ville de Charleroi</p>
          <div class="carte_holder" >
            <img src='/images/plan_court_terme.png' />
          </div>
        </div>
      </Step>
      <Step id="cartes-2" data={{
        x: 2650,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>Jusque quand?</h1>
          <p>Décembre 2023</p>
          <div class="carte_holder" >
            <img src='/images/plan_moyen_terme.png' />
          </div>
        </div>
      </Step>
      <Step id="cartes-3" data={{
        x: 3300,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>A quel coût?</h1>
          <p>€ 25 millions</p>
          <div class="carte_holder" >
            <img src='/images/plan_long_terme.png' />
          </div>
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