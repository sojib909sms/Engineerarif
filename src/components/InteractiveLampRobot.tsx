import React, { useState, useEffect, useRef } from 'react';

interface InteractiveLampRobotProps {
  isLit: boolean;
  onToggleLit: () => void;
}

// Satisfying mechanical lamp pull-string click sound using Web Audio API
export const playLampClickSound = (turningOn: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Mechanical switch click transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = turningOn ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(turningOn ? 980 : 720, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.045);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);

    // Follow-up metallic spring snap
    setTimeout(() => {
      try {
        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        const snapNow = ctx.currentTime;
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(1300, snapNow);
        snapOsc.frequency.exponentialRampToValueAtTime(320, snapNow + 0.03);
        snapGain.gain.setValueAtTime(0.18, snapNow);
        snapGain.gain.exponentialRampToValueAtTime(0.001, snapNow + 0.03);
        snapOsc.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapOsc.start(snapNow);
        snapOsc.stop(snapNow + 0.035);
      } catch (_) {}
    }, 40);
  } catch (_) {
    // Silently continue if audio context is restricted
  }
};

export const InteractiveLampRobot: React.FC<InteractiveLampRobotProps> = ({ isLit, onToggleLit }) => {
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [robotJoy, setRobotJoy] = useState(false);

  const dragStartYRef = useRef<number | null>(null);

  // Periodic blinking effect for the robot
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Handle pull cord physics (click and drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartYRef.current = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartYRef.current === null) return;
    const delta = Math.max(0, Math.min(e.clientY - dragStartYRef.current, 55));
    setPullY(delta);
  };

  const triggerCordAction = () => {
    // Animate snap-back
    setPullY(0);
    setIsDragging(false);
    dragStartYRef.current = null;

    // Sound and light toggle
    const nextLitState = !isLit;
    playLampClickSound(nextLitState);
    onToggleLit();

    // Cute robot reaction
    setRobotJoy(true);
    setTimeout(() => setRobotJoy(false), 800);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (pullY > 15) {
      triggerCordAction();
    } else {
      // Small drag, just spring back
      setPullY(0);
      setIsDragging(false);
      dragStartYRef.current = null;
    }
  };

  // Simple click on pull ring
  const handleRingClick = () => {
    if (isDragging && pullY > 10) return;
    setPullY(36);
    setTimeout(() => {
      triggerCordAction();
    }, 120);
  };

  return (
    <div className="relative w-full h-full min-h-[340px] flex flex-col items-center justify-between p-4 select-none overflow-hidden">
      
      {/* Dynamic Cone Light Beam when Lamp is Lit */}
      {isLit && (
        <div 
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[300px] h-[340px] pointer-events-none z-0 animate-in fade-in duration-300"
          style={{
            background: 'radial-gradient(ellipse at 50% 10%, rgba(0, 234, 175, 0.45) 0%, rgba(6, 182, 212, 0.22) 40%, rgba(13, 20, 36, 0) 75%)',
            clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Ambient background soft glow when lit */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none -z-10 ${
          isLit 
            ? 'opacity-100 bg-radial from-emerald-500/15 via-cyan-500/5 to-transparent' 
            : 'opacity-0'
        }`} 
      />

      {/* ================= TOP LAMP & CORD ================= */}
      <div className="relative w-full flex justify-center z-20 pt-1">
        {/* Lamp Ceiling Wire */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-9 bg-gradient-to-b from-slate-700 to-slate-800 shadow-sm" />

        {/* Lamp Fixture Container */}
        <div className="relative top-7 flex items-center justify-center">
          
          {/* Main Lamp Shade */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Top Collar */}
            <div className="w-5 h-2.5 bg-slate-700 rounded-t-md border-t border-slate-500/50" />
            
            {/* Metallic Dome Shade */}
            <div 
              className={`w-20 h-10 rounded-t-full border-t border-x transition-colors duration-500 flex items-end justify-center shadow-lg ${
                isLit 
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-emerald-500/60 shadow-[0_4px_25px_rgba(0,234,175,0.45)]' 
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 shadow-black/60'
              }`}
            >
              {/* Glowing Bulb inside the lamp */}
              <div 
                className={`w-10 h-4 rounded-b-full transition-all duration-300 ${
                  isLit 
                    ? 'bg-emerald-300 shadow-[0_0_35px_#00eaaf,0_0_15px_#fff] scale-105' 
                    : 'bg-slate-700/60'
                }`}
              />
            </div>

            {/* Glowing Accent Ring on Rim of Shade */}
            <div 
              className={`w-22 h-1 rounded-full transition-colors duration-300 -mt-0.5 ${
                isLit ? 'bg-[#00eaaf] shadow-[0_0_12px_#00eaaf]' : 'bg-slate-700'
              }`}
            />
          </div>

          {/* ================= INTERACTIVE PULL CORD ================= */}
          <div 
            className="absolute left-[calc(50%+28px)] top-4 z-30 flex flex-col items-center cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* The cord string line (stretches dynamically with pullY) */}
            <div 
              className="w-[2px] bg-gradient-to-b from-slate-400 via-amber-200/80 to-slate-300 transition-all origin-top shadow-sm"
              style={{
                height: `${48 + pullY}px`,
                transition: isDragging ? 'none' : 'height 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />

            {/* Pull Cord Handle / Ring */}
            <div 
              onClick={handleRingClick}
              className={`relative -mt-0.5 flex flex-col items-center group cursor-pointer transition-transform ${
                isDragging ? '' : 'transition-all duration-300 ease-out'
              }`}
              style={{
                transform: `translateY(${pullY * 0.15}px)`,
              }}
              title="Click or pull cord to toggle light"
            >
              {/* Metallic bead */}
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-md border border-amber-300/60" />
              
              {/* Chrome/Neon Ring */}
              <div 
                className={`w-4.5 h-6 rounded-full border-2 mt-0.5 transition-all flex items-center justify-center ${
                  isLit 
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_10px_rgba(0,234,175,0.7)]' 
                    : 'border-amber-300/80 bg-slate-900/80 hover:border-amber-200 hover:scale-110 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              </div>

              {/* Pulsing Hint Badge when light is OFF */}
              {!isLit && !isDragging && (
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-300 tracking-tight shadow-lg shadow-emerald-950/60 flex items-center gap-1 animate-bounce pointer-events-none">
                  <span>Pull!</span>
                  <span>↓</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ================= CUTE ROBOT MASCOT ================= */}
      <div 
        className={`relative z-10 my-auto pt-10 flex flex-col items-center transition-transform duration-300 ${
          robotJoy ? '-translate-y-2 scale-105' : 'hover:scale-102'
        }`}
      >
        {/* Floating bobbing wrapper */}
        <div 
          className="relative flex flex-col items-center"
          style={{
            animation: 'robotBob 3.6s ease-in-out infinite',
          }}
        >
          
          {/* SVG Robot Mascot */}
          <svg 
            width="170" 
            height="180" 
            viewBox="0 0 170 180" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Helmet Gradient */}
              <linearGradient id="robotHelmet" x1="20" y1="20" x2="150" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Rim Light Gradient */}
              <linearGradient id="rimLight" x1="30" y1="20" x2="140" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isLit ? "#00eaaf" : "#38bdf8"} stopOpacity="0.8" />
                <stop offset="50%" stopColor={isLit ? "#6ee7b7" : "#0284c7"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isLit ? "#00eaaf" : "#38bdf8"} stopOpacity="0.8" />
              </linearGradient>

              {/* Screen Visor Gradient */}
              <radialGradient id="visorBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#07131e" />
                <stop offset="100%" stopColor="#020611" />
              </radialGradient>

              {/* Glow filter for neon LED eyes */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* --- ANTENNA --- */}
            <path d="M85 32 L85 14" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle 
              cx="85" 
              cy="10" 
              r="6" 
              fill={isLit ? "#00eaaf" : "#10b981"} 
              filter={isLit ? "url(#neonGlow)" : undefined}
              className={isLit ? "animate-pulse" : ""}
            />
            {isLit && (
              <circle cx="85" cy="10" r="10" fill="#00eaaf" opacity="0.25" />
            )}

            {/* --- ROBOT EARS / AUDIO CAPS --- */}
            {/* Left Ear */}
            <rect x="18" y="58" width="10" height="34" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle 
              cx="23" 
              cy="75" 
              r="3.5" 
              fill={isLit ? "#00eaaf" : "#0284c7"} 
              filter={isLit ? "url(#neonGlow)" : undefined} 
            />

            {/* Right Ear */}
            <rect x="142" y="58" width="10" height="34" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle 
              cx="147" 
              cy="75" 
              r="3.5" 
              fill={isLit ? "#00eaaf" : "#0284c7"} 
              filter={isLit ? "url(#neonGlow)" : undefined} 
            />

            {/* --- MAIN HEAD / HELMET --- */}
            <rect 
              x="25" 
              y="32" 
              width="120" 
              height="88" 
              rx="28" 
              fill="url(#robotHelmet)" 
              stroke="url(#rimLight)" 
              strokeWidth="2" 
            />

            {/* Subtle top-left glass highlight on helmet */}
            <path 
              d="M 45 36 Q 85 34 125 36" 
              stroke="#94a3b8" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              opacity="0.35" 
            />

            {/* --- VISOR SCREEN --- */}
            <rect 
              x="36" 
              y="44" 
              width="98" 
              height="64" 
              rx="18" 
              fill="url(#visorBg)" 
              stroke="#1e293b" 
              strokeWidth="1.5" 
            />

            {/* Glass reflection gloss across visor */}
            <path 
              d="M 42 50 L 115 50 Q 80 72 42 66 Z" 
              fill="#ffffff" 
              opacity="0.06" 
            />

            {/* --- VISOR FACE FEATURES --- */}
            {isLit ? (
              /* ACTIVE / CHEERFUL SMILING ROBOT (LIGHT IS ON) */
              <g filter="url(#neonGlow)">
                {/* Left Eye */}
                {isBlinking ? (
                  <path d="M 52 74 Q 61 74 70 74" stroke="#00eaaf" strokeWidth="4" strokeLinecap="round" />
                ) : (
                  <path d="M 52 76 Q 61 65 70 76" stroke="#00eaaf" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                )}

                {/* Right Eye */}
                {isBlinking ? (
                  <path d="M 100 74 Q 109 74 118 74" stroke="#00eaaf" strokeWidth="4" strokeLinecap="round" />
                ) : (
                  <path d="M 100 76 Q 109 65 118 76" stroke="#00eaaf" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                )}

                {/* Glowing Cheeks Blush */}
                <ellipse cx="50" cy="85" rx="5" ry="2.5" fill="#10b981" opacity="0.6" />
                <ellipse cx="120" cy="85" rx="5" ry="2.5" fill="#10b981" opacity="0.6" />

                {/* Cheerful Mouth */}
                <path d="M 76 86 Q 85 95 94 86" stroke="#00eaaf" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              /* DORMANT / SLEEPY ROBOT (LIGHT IS OFF) */
              <g opacity="0.45">
                {/* Sleepy Eyes (- -) */}
                <line x1="53" y1="74" x2="69" y2="74" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                <line x1="101" y1="74" x2="117" y2="74" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                {/* Neutral Small Mouth */}
                <line x1="80" y1="88" x2="90" y2="88" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* --- NECK JOINT & COLLAR --- */}
            <rect x="73" y="120" width="24" height="8" rx="3" fill="#334155" />

            {/* --- TORSO & FLOATING CHEST PLATE --- */}
            <path 
              d="M 50 128 L 120 128 L 112 165 Q 85 174 58 165 Z" 
              fill="#0f172a" 
              stroke="#1e293b" 
              strokeWidth="2" 
            />

            {/* Center Energy Core */}
            <circle 
              cx="85" 
              cy="148" 
              r="7" 
              fill={isLit ? "#00eaaf" : "#1e293b"} 
              stroke={isLit ? "#6ee7b7" : "#334155"} 
              strokeWidth="2"
              filter={isLit ? "url(#neonGlow)" : undefined} 
            />

            {/* Left and Right Hovering Shoulder Pads */}
            <rect x="36" y="132" width="12" height="20" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <rect x="122" y="132" width="12" height="20" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          </svg>

          {/* Floating Shadow Below Robot */}
          <div 
            className="w-24 h-2.5 rounded-full bg-black/40 blur-sm mt-1 transition-transform duration-700"
            style={{
              transform: isLit ? 'scale(1.15)' : 'scale(0.9)',
              opacity: isLit ? 0.7 : 0.35,
            }}
          />

        </div>
      </div>

      {/* Bottom Status / Tip */}
      <div className="relative z-20 text-center pt-2">
        <span 
          className={`text-[11px] font-mono px-3 py-1 rounded-full transition-all duration-300 border ${
            isLit 
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(0,234,175,0.25)]' 
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          {isLit ? '✨ Lamp ON • Ready to Sign In' : '💡 Tip: Pull cord to turn on lamp'}
        </span>
      </div>

    </div>
  );
};
