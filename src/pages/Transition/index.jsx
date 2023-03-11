import React, { useEffect, useRef, useMemo, useState }  from 'react';
import { useNavigate } from "react-router-dom";
import GestureHandler from 'quantumleapjs';
import './index.css';


export default function Transition({ children }) {
  // State
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const [ready, setReady] = useState(false);
  const [thumbOk, setThumbOk] = useState(false);

  const navigate = useNavigate();

  // Gesture recognition
  const gestureHandlerRef = useRef(null);
  const slideTimeoutRef = useRef(null);
  const gestureCooldownTimeoutRef = useRef(null);
  const readyTimeoutRef = useRef(null);

  // Associate actions to gestures
  const gestureEventListener = useMemo(() => function(event) {
    if (gestureCooldown)
      return;

    switch(event.gesture.name) {
      case "thumb":
        setThumbOk(true);
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
    gestureHandlerRef.current.registerGestures('static', ['thumb']);
    gestureHandlerRef.current.addEventListener('gesture', gestureEventListener);
    gestureHandlerRef.current.connect();
    readyTimeoutRef.current = setTimeout(_ => {
      setReady(true);
    }, 10);
    gestureCooldownTimeoutRef.current = setTimeout(_ => {
      navigate('/');
    }, 20000);
    // Runs when component unmounts
    return () => {
      setGestureCooldown(false);
      clearTimeout(slideTimeoutRef.current);
      clearTimeout(gestureCooldownTimeoutRef.current);
      gestureHandlerRef.current.removeEventListeners();
      gestureHandlerRef.current.disconnect();
    }
  }, []);

  return (
    <div>
      <div className="trans_bg_image_container">
        <img className='trans_bg_image' src="/images/gare_futur.jpg"/>
      </div>
      <div className='trans_info_container'>
        <div style={{ height: '30px' }}></div>
        {/* BIG text */}
        <div className={ready ? 'trans_big_text_container' : 'trans_big_text_container trans_big_text_hidden' }>
          <p><span className='trans_bg_word' style={{ transitionDelay: '0.5s' }}>T'en</span> <span className='trans_bg_word' style={{ transitionDelay: '0.75s' }}>veux</span> <span className='trans_bg_word trans_word_highlight' style={{ transitionDelay: '1.0s' }}>plus?</span></p>
        </div>
        <div style={{ height: '30px' }}></div>
        {/* QR code */}
        <div className={ready ? 'trans_qr_code_container' : 'trans_qr_code_container trans_qr_code_container_hidden' }  style={{ transitionDelay: '1.25s' }}>
          <img className='trans_qr_code' src='/images/qr_code_transparent.png' />
        </div>
        <div style={{ height: '60px' }}></div>
        {/* Gesture video/gif */}
        <div className={ready ? 'trans_hint_image_container' : 'trans_hint_image_container trans_hidden' } style={{ transitionDelay: '1.5s' }}>
          <div className={thumbOk ? 'trans_bg_circle_ok trans_overlay' : 'trans_bg_circle trans_overlay' }></div>
          <div className='trans_hint_image_subcontainer trans_overlay'>
            <img className={thumbOk ? 'trans_hint_image_ok' : 'trans_hint_image' } src='/images/thumb.png' />
          </div>
        </div>
        {/* Hint text */}
        <div className={ready ? 'trans_hint_text_container' : 'trans_hint_text_container trans_hidden' } style={{ transitionDelay: '1.5s' }}>
          { thumbOk ?
            <p><span className='trans_bg_word'>Merci!</span></p>
          :
            <>
            <p><span className='trans_bg_word'>Ça t'a plu?</span></p>
            <div style={{ margin: '-10px' }}></div>
            <p><span className='trans_bg_word'>Donnes-nous ton avis avec un pouce!</span></p>
            </>
          }
          
        </div>
      </div>
    </div>
    
  );
}