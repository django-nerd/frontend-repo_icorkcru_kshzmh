import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Utility: positions relative to stage
const targetPoint = (stageBox, pos) => {
  const cx = stageBox.left + stageBox.width / 2;
  const cy = stageBox.top + stageBox.height / 2;
  const left = stageBox.left + 20 + 40; // inner padding guess (borders/visuals)
  const right = stageBox.right - 20 - 40;
  const top = stageBox.top + 20 + 40;
  const bottom = stageBox.bottom - 20 - 40;

  switch (pos) {
    case 'center':
      return { x: cx, y: cy };
    case 'top-left':
      return { x: left, y: top };
    case 'top-right':
      return { x: right, y: top };
    case 'bottom-left':
      return { x: left, y: bottom };
    case 'bottom-right':
      return { x: right, y: bottom };
    case 'left-center':
      return { x: stageBox.left + 20 + 40, y: cy };
    case 'right-center':
      return { x: stageBox.right - 20 - 40, y: cy };
    case 'top-center':
      return { x: cx, y: stageBox.top + 20 + 40 };
    case 'bottom-center':
      return { x: cx, y: stageBox.bottom - 20 - 40 };
    default:
      return { x: cx, y: cy };
  }
};

const displayHint = (method, pos) => {
  if (method === 'flex') {
    const map = {
      'center': 'display: flex; justify-content: center; align-items: center;',
      'top-left': 'display: flex; justify-content: flex-start; align-items: flex-start;',
      'top-right': 'display: flex; justify-content: flex-end; align-items: flex-start;',
      'bottom-left': 'display: flex; justify-content: flex-start; align-items: flex-end;',
      'bottom-right': 'display: flex; justify-content: flex-end; align-items: flex-end;',
      'left-center': 'display: flex; justify-content: flex-start; align-items: center;',
      'right-center': 'display: flex; justify-content: flex-end; align-items: center;',
      'top-center': 'display: flex; justify-content: center; align-items: flex-start;',
      'bottom-center': 'display: flex; justify-content: center; align-items: flex-end;',
    };
    return `/* Hint: on .stage use\n${map[pos]} */`;
  }
  if (method === 'grid') {
    const map = {
      'center': 'display: grid; place-items: center;',
      'top-left': 'display: grid; place-items: start start;',
      'top-right': 'display: grid; place-items: start end;',
      'bottom-left': 'display: grid; place-items: end start;',
      'bottom-right': 'display: grid; place-items: end end;',
      'left-center': 'display: grid; place-items: center start;',
      'right-center': 'display: grid; place-items: center end;',
      'top-center': 'display: grid; place-items: start center;',
      'bottom-center': 'display: grid; place-items: end center;',
    };
    return `/* Hint: try\n${map[pos]} */`;
  }
  if (method === 'absolute') {
    const map = {
      'center': '.stage{position:relative;} .crate{position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);}',
      'top-left': '.stage{position:relative;} .crate{position:absolute; top:0; left:0;}',
      'top-right': '.stage{position:relative;} .crate{position:absolute; top:0; right:0;}',
      'bottom-left': '.stage{position:relative;} .crate{position:absolute; bottom:0; left:0;}',
      'bottom-right': '.stage{position:relative;} .crate{position:absolute; bottom:0; right:0;}',
      'left-center': '.stage{position:relative;} .crate{position:absolute; top:50%; left:0; transform:translateY(-50%);}',
      'right-center': '.stage{position:relative;} .crate{position:absolute; top:50%; right:0; transform:translateY(-50%);}',
      'top-center': '.stage{position:relative;} .crate{position:absolute; top:0; left:50%; transform:translateX(-50%);}',
      'bottom-center': '.stage{position:relative;} .crate{position:absolute; bottom:0; left:50%; transform:translateX(-50%);}',
    };
    return `/* Hint: position the crate absolutely\n${map[pos]} */`;
  }
  return '/* Write CSS to move the crate to the target. */';
};

// Build 69 levels: rotating method requirements and positions, with tightening tolerance
const POSITIONS = [
  'center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-center',
  'right-center',
  'top-center',
  'bottom-center',
];
const METHODS = ['flex', 'grid', 'absolute'];

const makeLevels = () => {
  const levels = [];
  for (let i = 0; i < 69; i++) {
    const pos = POSITIONS[i % POSITIONS.length];
    // Increase difficulty by method phases and tolerance tightening
    let method;
    if (i < 23) method = 'flex';
    else if (i < 46) method = 'grid';
    else method = 'absolute';

    const tolerance = Math.max(12 - Math.floor(i / 8), 3); // shrink tolerance over time

    const starter = `/* Level ${i + 1} — Goal: move the crate to ${pos.replace('-', ' ')} using ${method}. */\n` +
      displayHint(method, pos) +
      `\n\n/* Write your CSS below. You can target .stage and .crate */\n.stage {\n  /* your styles */\n}\n.crate {\n  /* optional crate styles */\n}`;

    levels.push({
      id: i + 1,
      title: `Level ${i + 1}`,
      description: `Move the crate to ${pos.replace('-', ' ')} using ${method}.`,
      position: pos,
      method,
      tolerance,
      starterCSS: starter,
    });
  }
  return levels;
};

const LEVELS = makeLevels();

const GamePlay = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [cssCode, setCssCode] = useState(LEVELS[0].starterCSS);
  const [status, setStatus] = useState('Type CSS to solve the puzzle');
  const [completed, setCompleted] = useState(false);
  const stageRef = useRef(null);
  const crateRef = useRef(null);
  const styleRef = useRef(null);
  const validateTimeout = useRef(null);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleRef.current = styleEl;
    document.head.appendChild(styleEl);
    styleEl.textContent = cssCode;
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  // When level changes, reset code and status
  useEffect(() => {
    const lv = LEVELS[levelIndex];
    setCssCode(lv.starterCSS);
    setStatus(`Goal: ${lv.description}`);
    setCompleted(false);
  }, [levelIndex]);

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

    const lv = LEVELS[levelIndex];

    const stageStyles = window.getComputedStyle(stage);
    const crateStyles = window.getComputedStyle(crate);

    // Method checks
    let methodOk = true;
    if (lv.method === 'flex') methodOk = stageStyles.display.includes('flex');
    if (lv.method === 'grid') methodOk = stageStyles.display.includes('grid');
    if (lv.method === 'absolute') methodOk = crateStyles.position === 'absolute';

    const stageBox = stage.getBoundingClientRect();
    const crateBox = crate.getBoundingClientRect();
    const target = targetPoint(stageBox, lv.position);
    const crateCenter = { x: crateBox.left + crateBox.width / 2, y: crateBox.top + crateBox.height / 2 };
    const dist = Math.hypot(target.x - crateCenter.x, target.y - crateCenter.y);

    const closeEnough = dist <= lv.tolerance;

    if (methodOk && closeEnough) {
      setStatus(`Nice! ${lv.title} complete ✓`);
      setCompleted(true);
    } else {
      let methodMsg = '';
      if (!methodOk) {
        if (lv.method === 'flex') methodMsg = 'Make the arena a flex container.';
        if (lv.method === 'grid') methodMsg = 'Make the arena a grid container.';
        if (lv.method === 'absolute') methodMsg = 'Absolutely position the crate.';
      }
      const where = lv.position.replace('-', ' ');
      setStatus(methodMsg ? methodMsg : `Move the crate closer to ${where} (distance ${dist.toFixed(1)}px, need ≤ ${lv.tolerance}px).`);
      setCompleted(false);
    }
  };

  const resetLevel = () => {
    setCssCode(LEVELS[levelIndex].starterCSS);
    setCompleted(false);
    setStatus(`Goal: ${LEVELS[levelIndex].description}`);
  };

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
    }
  };

  const prevLevel = () => {
    if (levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  };

  const codeLines = useMemo(() => cssCode.split('\n').length, [cssCode]);

  return (
    <section id="play" className="relative w-full bg-gradient-to-b from-black to-slate-950 py-16 text-white">
      <div className="absolute inset-x-0 top-0 -z-0 h-32 bg-gradient-to-b from-fuchsia-500/20 to-transparent blur-2xl pointer-events-none" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">{LEVELS[levelIndex].title}: {LEVELS[levelIndex].description}</h2>
            <div className="text-xs text-white/60">Level {levelIndex + 1} / {LEVELS.length}</div>
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
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={resetLevel}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Reset
              </button>
              <button
                onClick={prevLevel}
                disabled={levelIndex === 0}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={nextLevel}
                disabled={!completed}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20 shadow' : 'border border-white/15 bg-white/5 text-white/80 disabled:opacity-40'}`}
              >
                Next Level
              </button>
              <span className="text-xs text-white/70">{status}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">Arena</h2>
            <span className="text-xs text-white/60">Goal: {LEVELS[levelIndex].position.replace('-', ' ')} • via {LEVELS[levelIndex].method}</span>
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
            Write CSS to move the crate. Your styles apply directly to this level. Use .stage for container layout and .crate for the box.
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamePlay;
