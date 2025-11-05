import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const defaultCSS = `/* Goal: Center the crate in the arena using Flexbox */
/* Hint: Try display: flex; justify-content: center; align-items: center; */

.stage {
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

const GamePlay = () => {
  const [cssCode, setCssCode] = useState(defaultCSS);
  const [status, setStatus] = useState('Type CSS to solve the puzzle');
  const stageRef = useRef(null);
  const crateRef = useRef(null);
  const styleRef = useRef(null);
  const validateTimeout = useRef(null);

  useEffect(() => {
    // Create a style tag scoped to this component root
    const styleEl = document.createElement('style');
    styleRef.current = styleEl;
    document.head.appendChild(styleEl);
    styleEl.textContent = cssCode;
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    if (!styleRef.current) return;
    styleRef.current.textContent = cssCode;

    if (validateTimeout.current) clearTimeout(validateTimeout.current);
    validateTimeout.current = setTimeout(() => {
      validateSolution();
    }, 200);
  }, [cssCode]);

  const validateSolution = () => {
    const stage = stageRef.current;
    const crate = crateRef.current;
    if (!stage || !crate) return;

    const s = window.getComputedStyle(stage);
    const isFlex = s.display.includes('flex');
    const hasCenter = ['center', 'space-evenly'].includes(s.justifyContent) || s.justifyContent.includes('center');
    const hasAlign = s.alignItems.includes('center');

    const stageBox = stage.getBoundingClientRect();
    const crateBox = crate.getBoundingClientRect();
    const stageCenter = { x: stageBox.left + stageBox.width / 2, y: stageBox.top + stageBox.height / 2 };
    const crateCenter = { x: crateBox.left + crateBox.width / 2, y: crateBox.top + crateBox.height / 2 };
    const dist = Math.hypot(stageCenter.x - crateCenter.x, stageCenter.y - crateCenter.y);

    const closeEnough = dist < 10; // px tolerance

    if (isFlex && hasCenter && hasAlign && closeEnough) {
      setStatus('Great! Crate centered — Level 1 Complete 🎉');
    } else if (isFlex) {
      setStatus('Getting close… adjust alignment to perfectly center.');
    } else {
      setStatus('Try turning the arena into a flex container.');
    }
  };

  const resetLevel = () => {
    setCssCode(defaultCSS);
  };

  const codeLines = useMemo(() => cssCode.split('\n').length, [cssCode]);

  return (
    <section id="play" className="relative w-full bg-gradient-to-b from-black to-slate-950 py-16 text-white">
      <div className="absolute inset-x-0 top-0 -z-0 h-32 bg-gradient-to-b from-fuchsia-500/20 to-transparent blur-2xl pointer-events-none" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">Level 1: Center the Crate</h2>
            <div className="text-xs text-white/60">Live Validation</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl shadow-fuchsia-500/10">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>CSS Editor</span>
              <span>{codeLines} lines</span>
            </div>
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              spellCheck={false}
              className="h-72 w-full resize-none rounded-lg bg-slate-950/70 p-4 font-mono text-[13px] leading-relaxed text-fuchsia-100 outline-none ring-1 ring-inset ring-white/10 focus:ring-cyan-400/40"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={resetLevel}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Reset
              </button>
              <span className="text-xs text-white/70">{status}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">Arena</h2>
            <span className="text-xs text-white/60">Goal: Center the crate</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            ref={stageRef}
            className="stage relative grid h-72 w-full place-items-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
            <div className="absolute inset-3 rounded-lg border border-cyan-400/20" />

            <motion.div
              ref={crateRef}
              drag={false}
              className="crate relative z-10 grid h-20 w-20 place-items-center rounded-lg border-2 border-amber-300 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/30"
            >
              <span className="select-none text-sm font-extrabold">CRATE</span>
              <div className="absolute -bottom-2 -right-2 h-3 w-3 rotate-45 rounded-sm bg-amber-300" />
            </motion.div>

            <div className="absolute left-4 top-4 h-10 w-10 rounded-full bg-fuchsia-500/50 blur-xl" />
            <div className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-cyan-400/40 blur-xl" />
          </motion.div>

          <div className="mt-3 text-xs text-white/70">
            Try different CSS strategies. Your styles apply directly to this level.
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamePlay;
