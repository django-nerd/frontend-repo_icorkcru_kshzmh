import React from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  const scrollToPlay = () => {
    const el = document.getElementById('play');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent"
        >
          FlexPlay CSS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg"
        >
          Learn modern CSS by solving playful, visual puzzles. Type CSS to move fruits, boxes, and shapes into place—level up your layout skills while having fun.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="mt-8 flex items-center gap-4"
        >
          <button
            onClick={scrollToPlay}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Play Now
          </button>
          <a
            href="#levels"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            View Levels
          </a>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 opacity-90 sm:grid-cols-4">
          {[
            'Flexbox',
            'Grid',
            'Alignment',
            'Positioning',
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
