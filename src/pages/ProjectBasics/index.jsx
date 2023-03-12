import React, { useEffect, useRef, useMemo, useState }  from 'react';
import GestureHandler from 'quantumleapjs';
import { useNavigate } from 'react-router';
import { Impress, Step } from '../../libs/react_impress/components';
import './index.css';

export default function ProjectBasics({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const gestureCooldownRef = useRef(gestureCooldown);
  useEffect(() => {
    gestureCooldownRef.current = gestureCooldown
  }, [gestureCooldown]);
  const [stepCoUnter, setStepCoUnter] = useState(0);
  const stepCoUnterRef = useRef(stepCoUnter);
  useEffect(() => {
    stepCoUnterRef.current = stepCoUnter
  }, [stepCoUnter]);

  const navigate = useNavigate();

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);

  const ref = useRef();

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldownRef.current)
      return;

    switch(event.gesture.name) {
      case "rhand_lswipe":
        setStepCoUnter(prev => prev + 1);
        if (stepCoUnterRef.current >= 4) {
          navigate('/transition');
        }
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
    }, 1500);
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
      <Step id="vision" data={
        {
          x: 0,
          y: 0
        }
      }>
        <div class="basics vision_future" style={{backgroundImage: "url(/images/gare_vision_future.png)", backgroundPosition: "center"}}>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className='bigger_plz1'><span style={{ background: "rgba(255,255,255,0.7)" }}>Notre futur</span></h1>
            <h2 className='bigger_plz2'><span style={{ background: "rgba(255,255,255,0.7)" }}>Cadre vert</span></h2>
            <p className='bigger_plz3'><span style={{ background: "rgba(255,255,255,0.7)" }}>La nature au coeur du centre-ville</span></p>
            <h2 className='bigger_plz2'><span style={{ background: "rgba(255,255,255,0.7)" }}>Mobilité</span></h2>
            <p className='bigger_plz3'><span style={{ background: "rgba(255,255,255,0.7)" }}>Modes de transport doux & en commun</span></p>
            <h2 className='bigger_plz2'><span style={{ background: "rgba(255,255,255,0.7)" }}>Accessibilité pour tous</span></h2>
          </div>
        </div>
      </Step>
      {/*
      We use a single step for this view, because the card should be located at the same place in all 3
      */}
      <Step id="cartes-1" data={{
        x: 1500,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>Par qui?</h1>
          <p>SNCB, IGRETEC, Ville de Charleroi</p>
          <div class="carte_holder" >  
            <img src='/images/plan_court_terme.png' />
            <p>Situation actuelle</p>
          </div>
        </div>
      </Step>
      <Step id="cartes-2" data={{
        x: 2600,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>Jusque quand?</h1>
          <p>Décembre 2023</p>
          <div class="carte_holder" >
            <img src='/images/plan_moyen_terme.png' />
            <p>Futur proche</p>
          </div>
        </div>
      </Step>
      <Step id="cartes-3" data={{
        x: 3700,
        y: 0
      }}>
        <div class="basics cartes" >
          <h1>A quel coût?</h1>
          <p>€ 25 millions</p>
          <div class="carte_holder" >
            
            <img src='/images/plan_long_terme.png' />
            <p>Futur lointain</p>
          </div>
        </div>
      </Step>
      <Step id="concluuuuusion" data={
        {
          x: 2000,
          y: 0,
          scale: 5
        }
      }>
        <div class="basics">
          <h1 style={{ fontSize: '50pt' }}>Plus qu'un projet, notre mission</h1>
          <ul style={{ fontSize: '35pt' }}>
            <li>Une ville inclusive</li>
            <li>Une ville durable</li>
            <li>Des services publics performants</li>
          </ul>
        </div>
      </Step>
    </Impress>
    <div className='gesture_hint_swipe'>
      <img src='/images/swipe_gesture.gif' />
    </div>
  </div>
  );
}