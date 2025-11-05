import React from 'react';

const SiteFooter = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <div className="text-lg font-bold tracking-tight">FlexPlay CSS</div>
          <p className="mt-1 text-xs text-white/60">Practice CSS through interactive, gamified challenges.</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/70">
          <a href="#levels" className="hover:text-white">Levels</a>
          <a href="#play" className="hover:text-white">Play</a>
          <a href="#" className="hover:text-white">Leaderboard</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
