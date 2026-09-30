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
  placeholder = 'Enter statutory access key...',
  id = 'hostile-password',
  required = false,
}) => {
  const [inputType, setInputType] = useState<'text' | 'password'>('password');
  const [displayMode, setDisplayMode] = useState<'normal' | 'rot13'>('normal');
  const { vowelFilter } = useChaos();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);

    const types: ('text' | 'password')[] = ['text', 'password'];
    setInputType(types[Math.floor(Math.random() * types.length)]);

    if (Math.random() > 0.4) {
      setDisplayMode((prev) => (prev === 'normal' ? 'rot13' : 'normal'));
    }
  };

  const displayedValue = displayMode === 'rot13' ? rot13(value) : value;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="text-xs font-mono font-medium text-parchment-muted">
          {vowelFilter('Statutory Credential / Soil Access Key')}
        </label>
        <span className="text-[10px] font-mono text-regulatory-gold">
          CIPHER STATUS: {inputType.toUpperCase()} {displayMode === 'rot13' ? '(ROT-13 DRIFT)' : ''}
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
        className="w-full bg-peat-dark text-parchment-drab border border-bureau-green focus:border-regulatory-gold focus:outline-none p-2.5 font-mono text-sm tracking-wider shadow-inner"
      />
      <div className="text-[10px] text-lichen-stone font-mono mt-1">
        * Key input undergoes automated rotational shifting in compliance with municipal soil secrecy protocols.
      </div>
    </div>
  );
};
