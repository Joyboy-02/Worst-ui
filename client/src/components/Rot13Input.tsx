import React, { useState } from 'react';
import { useChaos } from '../context/ChaosContext';

interface Rot13InputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
}

const rot13 = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
};

export const Rot13Input: React.FC<Rot13InputProps> = ({
  value,
  onChange,
  placeholder = 'Enter password...',
  id = 'hostile-password',
  required = false,
}) => {
  const [inputType, setInputType] = useState<'text' | 'password'>('password');
  const [displayMode, setDisplayMode] = useState<'normal' | 'rot13'>('normal');
  const { vowelFilter } = useChaos();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);

    // Hostile keystroke mutation: randomly change type between text and password
    const types: ('text' | 'password')[] = ['text', 'password'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setInputType(randomType);

    // Randomly switch displayMode to rot13
    if (Math.random() > 0.4) {
      setDisplayMode((prev) => (prev === 'normal' ? 'rot13' : 'normal'));
    }
  };

  const displayedValue = displayMode === 'rot13' ? rot13(value) : value;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="text-xs font-mono font-bold text-gray-300">
          {vowelFilter('Secret Credential / Passphrase')}
        </label>
        <span className="text-[10px] font-mono text-pink-500 animate-pulse">
          MODE: {inputType.toUpperCase()} {displayMode === 'rot13' ? '(ROT-13 SHIFTED)' : ''}
        </span>
      </div>

      <input
        id={id}
        type={inputType}
        value={displayedValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full bg-neutral-900 text-yellow-300 border-2 border-yellow-500 focus:border-toxic-green focus:outline-none p-2.5 font-mono text-sm tracking-wider shadow-[3px_3px_0px_#000]"
      />
      <div className="text-[10px] text-gray-500 font-mono mt-1">
        * Keystrokes undergo quantum rot-13 entanglement to resist surveillance.
      </div>
    </div>
  );
};
