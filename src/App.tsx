import { useState, useEffect } from 'react';
import rsvpLogo from '/logo.png';
import './App.css'
import SpeedSelector from './components/SpeedSelector';

const SAMPLE_TEXT = `'Di mo lang alam, naiisip kita Baka sakali lang maisip mo ako 'Di mo lang alam, hanggang sa gabi Inaasam makita kang muli`;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [wpm,setWpm] = useState(300);

  // sample`
  const words = SAMPLE_TEXT.split(" ");
  // const currentWord = words[index];

  // switches words bssed on wpm
  useEffect(() => {
    let interval: number;

    if(isPlaying && index < words.length) {
      // calculate how many milliseconds to wait per word
      const msPerWord = 60000 / wpm;

      interval = setInterval (() => {
        setIndex((prevIndex) => {
          // stop if end is reacher
          if (prevIndex >= words.length -1){
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex +1;
        });
      }, msPerWord);
    }

    return () => clearInterval(interval);
  }, [isPlaying, wpm, index, words.length]);

  // handle play/pause
  const togglePlay = () => {
    if (index >= words.length - 1){
      setIndex(0); // restart if finished
    }
    setIsPlaying(!isPlaying);
  };

  // helper to color middle letter
  const renderWord = (word: string) => {
    const centerIndex = Math.floor(word.length /2);
    return (
      <>
        {word.slice(0,centerIndex)}
        <span style={{ color: 'red' }}>{word[centerIndex]}</span>
        {word.slice(centerIndex +1)}
      </>
    )
  }

  return (
    <>
      
      <div className="header">
        <img src={rsvpLogo} className="logo" alt="RSVP Logo" />
      </div>

      <div className="card">
        <span className='word-card'>
          {renderWord(words[index])}
        </span>
      </div>

      <div className="controls">
        <button className='toggle-play' onClick={togglePlay}>
          {isPlaying ? "Pause" : index >= words.length -1 ? "Restart" : "Start"}
        </button>
        <SpeedSelector
          currentSpeed={wpm}
          onSpeedChange={setWpm}
        />
      </div>

    </>
  )
}

export default App

// https://mymodernmet.com/speed-reading-rapid-serial-visual-presentation/