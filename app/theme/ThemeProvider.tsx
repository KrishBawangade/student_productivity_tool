'use client';

import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  activeCopilotOpen: boolean;
  setActiveCopilotOpen: (open: boolean) => void;
  activeGradeModalOpen: boolean;
  setActiveGradeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [activeCopilotOpen, setActiveCopilotOpen] = useState(false);
  const [activeGradeModalOpen, setActiveGradeModalOpen] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        volume,
        setVolume,
        activeCopilotOpen,
        setActiveCopilotOpen,
        activeGradeModalOpen,
        setActiveGradeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
