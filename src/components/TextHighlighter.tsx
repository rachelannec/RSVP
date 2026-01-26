import React, {useEffect, useRef } from 'react';
import '../styles/TextHighlighter.css';

interface TextHighlighterProps {
    text: string;
    setText: (text: string) => void;
    words: string[];
    isPlaying: boolean;
    currentIndex: number;
    onEdit: () => void; // called when user types 
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
    text, 
    setText,
    words,
    isPlaying, 
    currentIndex,
    onEdit
}) => {
    const activeWordRef = useRef<HTMLSpanElement>(null);

    return (
        <div className="container">
            <label>
                {isPlaying ? "Reading... (Click to edit)" : "Input Text"}
            </label>

            {isPlaying ? (
                // ----- view mode: highlighter text
                <div 
                className="view-mode"
                onClick={onEdit}
                style={{ cursor: 'text' }}>
                    {words.map((word, i) => (
                        <span
                        key={i}
                        ref={i === currentIndex ? activeWordRef: null}
                        className={i === currentIndex ? 'active-word' : ''}
                        >
                            {word}{" "}
                        </span>
                    ))}
                </div>
            ) : (
                // ----- edit mode: textarea
                <textarea 
                autoFocus
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    onEdit(); // notify parent to reset index/stop playing
                }}
                className='text-area'
                placeholder='Paste your article here...'></textarea>
            )}
        </div>
    )
}

export default TextHighlighter;