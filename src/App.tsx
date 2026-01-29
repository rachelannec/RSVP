import { useState, useEffect } from 'react';
import rsvpLogo from '/logo.png';
import './App.css'
import SpeedSelector from './components/SpeedSelector';
import TextHighlighter from './components/TextHighlighter';

// const SAMPLE_TEXT = `'Di mo lang alam, naiisip kita Baka sakali lang maisip mo ako 'Di mo lang alam, hanggang sa gabi Inaasam makita kang muli`;

const ABOUT_RSVP = `What is RSVP? 
RSVP stands for Rapid Serial Visual Presentation, a term coined by psychology professor and researcher Mary Potter. It is a technique designed to increase reading speed by changing how words are presented to the eye.

How It Works 
Stationary Eyes: Instead of your eyes moving across a page to read words side-by-side, RSVP flashes words on the screen one by one in the same spot.

The "Red Letter" Anchor: Many RSVP programs highlight a specific letter in each word (often in red). This serves as a focal point to anchor your gaze, ensuring your eyes don't wander and allowing your brain to recognize the word instantly.

Visual Processing: The technique trains your brain to process words as visual images (like recognizing a logo) rather than reading them letter-by-letter.

Benefits 
Drastically Increased Speed: While the average person reads about 238 words per minute (wpm), RSVP can help users reach speeds of up to 900 wpm.

Example: At 900 wpm, you could read Jane Austen's Pride and Prejudice in just 2 hours and 22 minutes, compared to the 8.5 hours it takes at an average pace.

Improved Focus: Because the words appear rapidly and in a fixed location, the technique forces you to stay focused and eliminates the time lost to eye movements.`;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [wpm,setWpm] = useState(300);
  const [text, setText] = useState(ABOUT_RSVP);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  })
  const [isFullscreen, setIsFullscreen] = useState(false);

  const words = text.split(" ").filter(Boolean);
  const currentWord = words[index] || "";
  const isListEmpty = text.trim().length === 0;

  // ----- switches words bssed on wpm
  useEffect(() => {
    let interval: number;

    if(isPlaying && !isListEmpty && index < words.length) {
      // calculate how many milliseconds to wait per word
      const msPerWord = 60000 / wpm;

      interval = setInterval (() => {
        setIndex((prevIndex) => {
          // stop if end is reached
          if (prevIndex >= words.length -1){
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex +1;
        });
      }, msPerWord);
    }

    return () => clearInterval(interval);
  }, [isPlaying, wpm, index, words.length, isListEmpty]);

  // ----- countdown 
  useEffect(() => {
    // if countdown is null, do nothing
    if (countdown === null) return;

    // if countdown > 0, decrease after 1 second
    // else if countdown 0, play
    if(countdown > 0){
      const timer = setTimeout(() => {
        setCountdown(countdown -1);
      }, 1000); // 1 sec delay
      return ()=> clearTimeout(timer);
    } else if (countdown === 0){
      setCountdown(null);
      setIsPlaying(true); // start reading
    }
  }, [countdown]);

  // ----- theme effect
  useEffect(() =>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ----- escape key listener for fullscreen
  useEffect(() =>{
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Escape' && isFullscreen){
        setIsFullscreen(false);
        setIsPlaying(false);
        setCountdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return() => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // helper play/pause
  const togglePlay = () => {
    // A - if playing OR counting down, pause
    if(isPlaying || countdown !== null){
      setIsPlaying(false);
      setCountdown(null);
      setIsFullscreen(false); // to exit fullscreen
      return;
    }

    // B - if stopped -> start countdown
    if (index >= words.length - 1){
      setIndex(0); // restart if finished
    }
    setIsFullscreen(true); // enter fullscreen
    setCountdown(3); // 3 sec countdown
    // setIsPlaying(!isPlaying);
  };

  // helper to color middle letter
  const renderWord = (word: string) => {
    if (!word) return null;
    const centerIndex = Math.floor(word.length /2);
    return (
      <>
        {word.slice(0,centerIndex)}
        <span className='focal-point'>{word[centerIndex]}</span>
        {word.slice(centerIndex +1)}
      </>
    )
  }

  // helper to toggle theme
  const toggleTheme= () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  return (
    <>
      
      <div className="container">
        {/* ----- HEADER */}
        <div className="header">
          <img src={rsvpLogo} className="logo" alt="RSVP Logo" />
          <div className="theme-toggle">
            <i 
            id='theme-toggle' 
            onClick={toggleTheme}
            className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </div>
        </div>

        {/* ----- CARD */}
        <div 
        className={`card ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={() => {
          if (isFullscreen) togglePlay;
        }}>
          <span className='word-card'>
            {countdown !== null ? (
              <span className="countdown">{countdown}</span>
            ) : currentWord ? (
              <span className="word-card">{renderWord(currentWord)}</span>
            ) : (
              <span className="card-placeholder">
                Enter text below...
              </span>
            )}
          </span>
          {isFullscreen &&(
            <div className='fullscreen-hint'>
              Press ESC or Click to Stop
            </div>
          )}
        </div>

        {/* ----- CONTROL */}
        <div className={`controls ${isFullscreen ? 'fullscreen' : ''}`}>
          <button 
            className='toggle-play' 
            onClick={togglePlay}
            disabled={isListEmpty}>
            {countdown !== null ? "Cancel" : isPlaying ? "Pause" : index >= words.length -1 ? "Restart" : "Start"}
          </button>
          <SpeedSelector
            currentSpeed={wpm}
            onSpeedChange={setWpm}
          />
        </div>

        {/* ----- INPUT */}
        <div className="input">
          <TextHighlighter
            text={text}
            setText={setText}
            words={words}
            isPlaying={isPlaying}
            currentIndex={index}
            onEdit={() => {
              setIsPlaying(false);
              setIndex(0);
              setCountdown(null);
            }}
          />
        </div>
      </div>

    </>
  )
}

export default App

// https://mymodernmet.com/speed-reading-rapid-serial-visual-presentation/