import React from 'react';
import { motion } from 'framer-motion';

const levels = [
  {
    title: 'Line Up the Fruits',
    tag: 'Flexbox Basics',
    gradient: 'from-pink-500 to-rose-500',
    desc: 'Use justify-content to align apples in a row.',
  },
  {
    title: 'Perfect Grid',
    tag: 'CSS Grid',
    gradient: 'from-cyan-500 to-sky-500',
    desc: 'Arrange boxes into a 3x3 grid using grid-template.',
  },
  {
    title: 'Treasure Corners',
    tag: 'Positioning',
    gradient: 'from-amber-400 to-orange-500',
    desc: 'Place gems precisely in each corner with absolute positioning.',
  },
  {
    title: 'Center Stage',
    tag: 'Alignment',
    gradient: 'from-emerald-400 to-teal-500',
    desc: 'Center an object vertically and horizontally.',
  },
];

const LevelPreviews = () => {
  return (
    <section id="levels" className="w-full bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Level Previews</h3>
            <p className="mt-2 text-sm text-white/70">Unlock progressively harder challenges as you master each concept.</p>
          </div>
          <a href="#play" className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
            Jump to Game
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4"
            >
              <div className={`pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br ${l.gradient} opacity-30 blur-2xl`} />
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] text-white/80">{l.tag}</span>
                <span className="text-[10px] text-white/60">#{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h4 className="text-base font-semibold">{l.title}</h4>
              <p className="mt-2 text-sm text-white/70">{l.desc}</p>
              <div className="mt-6 h-20 w-full rounded-lg border border-white/10 bg-black/20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelPreviews;
