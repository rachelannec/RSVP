import React, { useState } from 'react';
import '../styles/SpeedSelector.css';

interface SpeedSelectorProps {
    currentSpeed: number;
    onSpeedChange: (speed: number) => void;
}

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ currentSpeed, onSpeedChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // options for speed
    const speedOptions = [200, 250, 300, 350, 400, 450, 500];

    const handleSelect = (speed:number) => {
        onSpeedChange(speed);
        setIsOpen(false); // close dropdown after selection
    };

    return (
        <div className="dropdown relative inline-block text-left">
            <button onClick={() => setIsOpen(!isOpen)}
                type='button'
                className='inline-flex items-center gap-2 px-4 py-2 bg-[#557c55] text-white rounded-lg hover:bg-[#446b44] transition-colors'>
                <span>{currentSpeed} wpm </span>
                <i className={`fa-solid fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* only render if isOpen is true */}
            {isOpen && (
                <div className="dropdown-menu absolute right-0 mt-2 w-full min-w-[120px]  overflow-hidden z-10">
                    <ul className="py-1">
                        {speedOptions.map((speed) => (
                        <li key={speed}>
                            <button
                            onClick={() => handleSelect(speed)}
                            >
                            {speed} wpm
                            </button>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SpeedSelector;