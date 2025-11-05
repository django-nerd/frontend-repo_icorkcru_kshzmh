import React from 'react';
import Hero from './components/Hero';
import GamePlay from './components/GamePlay';
import LevelPreviews from './components/LevelPreviews';
import SiteFooter from './components/SiteFooter';

function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Hero />
      <GamePlay />
      <LevelPreviews />
      <SiteFooter />
    </div>
  );
}

export default App;
