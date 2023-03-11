import React, { useEffect, useRef, useMemo, useState }  from 'react';
import { useNavigate } from "react-router-dom";
import GestureHandler from 'quantumleapjs';
import './index.css';

export default function AttentionGrabber({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const gestureCooldownRef = useRef(gestureCooldown);
  useEffect(() => {
    gestureCooldownRef.current = gestureCooldown
  }, [gestureCooldown]);
  const [presenceDetected, setPresenceDetected] = useState(false);
  const presenceDetectedRef = useRef(presenceDetected);
  useEffect(() => {
    presenceDetectedRef.current = presenceDetected
  }, [presenceDetected]);
  const [nextStepReady, setnextStepReady] = useState(false);
  const nextStepReadyRef = useRef(nextStepReady);
  useEffect(() => {
    nextStepReadyRef.current = nextStepReady
  }, [nextStepReady]);
  
  const navigate = useNavigate();

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);
  const frameCooldownTimeoutRef = useRef(null);
  const nextStepReadyTimeoutRef = useRef(null);

  // Associate actions to frame received
  const frameEventListener = useMemo(() => function(event) {
    clearTimeout(frameCooldownTimeoutRef.current);
    if (presenceDetectedRef.current == false) {
      nextStepReadyTimeoutRef.current = setTimeout(_ => {
        setnextStepReady(true);
      }, 1.2);
    }
    frameCooldownTimeoutRef.current = setTimeout(_ => {
      setPresenceDetected(false);
      setnextStepReady(false);
    }, 2000);
    setPresenceDetected(true);
  });

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldownRef.current)
      return;

    switch(event.gesture.name) {
      case "thumb":
        console.log(presenceDetectedRef.current, "thumb")
        if (presenceDetectedRef.current) {
          navigate('/basics');
        }
        break;
      default:
        console.error(`Unknown gesture: ${event.gesture.name}`);
        return;
    }

    setGestureCooldown(true);
    gestureCooldownTimeoutRef.current = setTimeout(_ => {
      setGestureCooldown(false);
    }, 1500);
  }, [gestureCooldown, presenceDetected]);

  // Runs only when component is mounted
  useEffect(() => {
    gestureHandlerRef.current = new GestureHandler();
    gestureHandlerRef.current.registerGestures('static', ['thumb']);
    gestureHandlerRef.current.addEventListener('gesture', gestureEventListener);
    gestureHandlerRef.current.addEventListener('frame', frameEventListener);
    gestureHandlerRef.current.connect();
    // Runs when component unmounts
    return () => {
      setGestureCooldown(false);
      clearTimeout(gestureCooldownTimeoutRef.current);
      clearTimeout(frameCooldownTimeoutRef.current);
      clearTimeout(nextStepReadyTimeoutRef.current);
      gestureHandlerRef.current.removeEventListeners();
      gestureHandlerRef.current.disconnect();
    }
  }, []);

  return (
    <div>
      {/* Background image */}
      <div className="bg_image_container">
        <img className={presenceDetected ? 'bg_image' : 'bg_image zoom'} src="/images/attention_grabber_img.jpeg"/>
      </div>
      <div className='info_container'>
        {/* BIG text */}
        <div className={presenceDetected ? 'big_text_container' : 'big_text_container big_text_hidden'}>
          <p><span className='bg_word word_highlight' style={{ transitionDelay: '0.5s' }}>Marre</span> <span className='bg_word' style={{ transitionDelay: '0.75s' }}>des</span></p>
          <p><span className='bg_word' style={{ transitionDelay: '1.0s' }}>travaux?</span></p>
        </div>
        <div style={{ height: '8%' }}></div>
        {/* Gesture video/gif */}
        <div className={presenceDetected ? 'hint_image_container' : 'hint_image_container hidden'} style={{ transitionDelay: '1.5s' }}>
          <div className='bg_circle overlay'></div>
          <div className='hint_image_subcontainer overlay'>
            <img className='hint_image' src='/images/thumb.png' />
          </div>
        </div>
        {/* Hint text */}
        <div className={presenceDetected ? 'hint_text_container' : 'hint_text_container hidden'} style={{ transitionDelay: '1.5s' }}>
          <p>Montre ton pouce pour donner ton avis!</p>
        </div>
      </div>
    </div>
  );
}