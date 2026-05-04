import React, { useState, useMemo, useEffect } from 'react';
import { Binary, Zap, Cpu, Activity, ShieldAlert, TerminalSquare, RotateCcw, CornerDownLeft, Space as SpaceIcon, Trash2, Radio } from 'lucide-react';

const nodes = [
  { id: 'ROOT', label: 'START', type: 'root', x: 50, y: 10, parent: null },
  { id: 'E', label: 'E', type: 'dit', x: 25, y: 28, parent: 'ROOT' },
  { id: 'T', label: 'T', type: 'dah', x: 75, y: 28, parent: 'ROOT' },
  { id: 'I', label: 'I', type: 'dit', x: 12.5, y: 46, parent: 'E' },
  { id: 'A', label: 'A', type: 'dah', x: 37.5, y: 46, parent: 'E' },
  { id: 'N', label: 'N', type: 'dit', x: 62.5, y: 46, parent: 'T' },
  { id: 'M', label: 'M', type: 'dah', x: 87.5, y: 46, parent: 'T' },
  { id: 'S', label: 'S', type: 'dit', x: 6.25, y: 64, parent: 'I' },
  { id: 'U', label: 'U', type: 'dah', x: 18.75, y: 64, parent: 'I' },
  { id: 'R', label: 'R', type: 'dit', x: 31.25, y: 64, parent: 'A' },
  { id: 'W', label: 'W', type: 'dah', x: 43.75, y: 64, parent: 'A' },
  { id: 'D', label: 'D', type: 'dit', x: 56.25, y: 64, parent: 'N' },
  { id: 'K', label: 'K', type: 'dah', x: 68.75, y: 64, parent: 'N' },
  { id: 'G', label: 'G', type: 'dit', x: 81.25, y: 64, parent: 'M' },
  { id: 'O', label: 'O', type: 'dah', x: 93.75, y: 64, parent: 'M' },
  { id: 'H', label: 'H', type: 'dit', x: 3.125, y: 82, parent: 'S' },
  { id: 'V', label: 'V', type: 'dah', x: 9.375, y: 82, parent: 'S' },
  { id: 'F', label: 'F', type: 'dit', x: 15.625, y: 82, parent: 'U' },
  { id: 'L', label: 'L', type: 'dit', x: 28.125, y: 82, parent: 'R' },
  { id: 'P', label: 'P', type: 'dit', x: 40.625, y: 82, parent: 'W' },
  { id: 'J', label: 'J', type: 'dah', x: 46.875, y: 82, parent: 'W' },
  { id: 'B', label: 'B', type: 'dit', x: 53.125, y: 82, parent: 'D' },
  { id: 'X', label: 'X', type: 'dah', x: 59.375, y: 82, parent: 'D' },
  { id: 'C', label: 'C', type: 'dit', x: 65.625, y: 82, parent: 'K' },
  { id: 'Y', label: 'Y', type: 'dah', x: 71.875, y: 82, parent: 'K' },
  { id: 'Z', label: 'Z', type: 'dit', x: 78.125, y: 82, parent: 'G' },
  { id: 'Q', label: 'Q', type: 'dah', x: 84.375, y: 82, parent: 'G' },
];

const playBeep = (type: 'dit' | 'dah') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  
  const duration = type === 'dit' ? 0.1 : 0.3;
  gain.gain.setValueAtTime(0.5, ctx.currentTime + duration - 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  
  osc.stop(ctx.currentTime + duration);
};

export default function App() {
  const [decodedMessage, setDecodedMessage] = useState<string>('');

  const handleSaveChar = (char: string) => {
    setDecodedMessage(prev => prev + char);
  };

  const handleAddSpace = () => {
    setDecodedMessage(prev => prev + ' ');
  };

  const handleClear = () => {
    setDecodedMessage('');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-300 font-mono selection:bg-red-500/30 selection:text-red-200 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-800/80 bg-[#0a0b0e] flex items-center justify-between z-20 sticky top-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-md border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <Radio className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-lg font-bold text-zinc-200 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
            Morse Code Decoder
          </h1>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded shadow-[0_0_15px_rgba(16,185,129,0.1)] text-emerald-400 text-xs">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-bold tracking-widest">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 w-full mx-auto p-3 sm:p-6 grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4 sm:gap-6 max-w-[2000px]">
        {/* Left Side: Decoder */}
        <div className="w-full flex flex-col min-h-[500px] xl:h-[calc(100vh-120px)]">
          <DecoderComponent onSaveChar={handleSaveChar} onAddSpace={handleAddSpace} />
        </div>
        
        {/* Right Side: Message Board */}
        <div className="w-full flex flex-col min-h-[300px] sm:min-h-[400px] xl:h-[calc(100vh-120px)]">
          <MessageBoard message={decodedMessage} onClear={handleClear} />
        </div>
      </main>
    </div>
  );
}

function MessageBoard({ message, onClear }: { message: string, onClear: () => void }) {
  return (
    <div className="h-full flex flex-col border border-zinc-800 rounded-2xl bg-[#0a0b0e] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden select-none">
      <div className="px-4 sm:px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#0e1015] z-10">
        <div className="flex items-center gap-3 text-zinc-400">
          <TerminalSquare className="w-5 h-5" />
          <h2 className="text-sm font-bold tracking-widest uppercase">Decoded Message Log</h2>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded transition-all active:scale-95 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="font-bold tracking-widest">CLEAR</span>
        </button>
      </div>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto relative bg-[#07080a]">
        {/* grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative font-mono text-xl sm:text-2xl lg:text-3xl tracking-widest leading-relaxed text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] break-words whitespace-pre-wrap">
          {message}
          <span className="inline-block w-2.5 sm:w-3 lg:w-4 h-5 sm:h-6 lg:h-8 bg-emerald-400 ml-1 animate-pulse align-middle" />
        </div>
        {message.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-600 text-xs sm:text-sm tracking-widest text-center pointer-events-none w-full px-4">
            AWAITING INPUT...
          </div>
        )}
      </div>
    </div>
  );
}

function DecoderComponent({ onSaveChar, onAddSpace }: { onSaveChar: (c: string) => void, onAddSpace: () => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  
  const activePathInfo = useMemo(() => {
    const path = ['ROOT'];
    let currentNodeId = 'ROOT';
    
    for (const step of sequence) {
      const nextNode = nodes.find(n => n.parent === currentNodeId && n.type === step);
      if (nextNode) {
        path.push(nextNode.id);
        currentNodeId = nextNode.id;
      } else {
        break; // Max depth reached or invalid sequence
      }
    }
    
    const lastNode = nodes.find(n => n.id === currentNodeId);
    return {
      path,
      targetChar: lastNode && lastNode.id !== 'ROOT' ? lastNode.label : 'NONE',
    };
  }, [sequence]);

  const activePath = activePathInfo.path;
  const targetChar = activePathInfo.targetChar;

  const handleInput = (type: 'dit' | 'dah') => {
    if (sequence.length < 4) {
      playBeep(type);
      setSequence(prev => [...prev, type]);
    }
  };

  const handleReset = () => {
    setSequence([]);
  };

  const handleSave = () => {
    if (targetChar !== 'NONE') {
      onSaveChar(targetChar);
      setSequence([]);
    }
  };

  const handleSpace = () => {
    onAddSpace();
    setSequence([]);
  };

  // Allow keyboard input as well
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === '.' || e.key === 'ArrowLeft') {
        handleInput('dit');
      } else if (e.key === '-' || e.key === 'ArrowRight') {
        handleInput('dah');
      } else if (e.key === 'Backspace' || e.key === 'Escape' || e.key === 'Delete') {
        handleReset();
      } else if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === ' ') {
        e.preventDefault(); // prevent scrolling
        handleSpace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, targetChar]);

  const SVG_WIDTH = 1200;
  const SVG_HEIGHT = 800;

  const getX = (pct: number) => (pct / 100) * SVG_WIDTH;
  const getY = (pct: number) => (pct / 100) * SVG_HEIGHT;

  const seqString = sequence.map(s => s === 'dit' ? '.' : '-').join(' ');

  return (
    <div className="h-full relative border border-zinc-800 rounded-2xl bg-[#0a0b0e] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col select-none">
      {/* Tactical Header */}
      <div className="relative px-4 sm:px-6 py-4 border-b border-zinc-800/80 flex flex-wrap items-center justify-between bg-[#0e1015] z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-red-500/10 rounded-md border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <Binary className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-[0.2em]">Hardware Matrix</h2>
            <div className="text-[10px] text-zinc-500 tracking-widest mt-0.5 flex items-center gap-2">
              <span>HW_DIRECT</span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>SEC_7</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-end hidden md:flex">
            <div className="text-[10px] text-zinc-500 tracking-widest">TRACE STATUS</div>
            <div className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5 mt-0.5 uppercase">
              {sequence.length > 0 ? 'ACTIVE' : 'STANDBY'}
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800 hidden md:block"></div>
          <div className={`flex items-center gap-2 px-3 py-1.5 border rounded text-xs transition-colors duration-300 ${
            sequence.length > 0 
              ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-400' 
              : 'bg-zinc-800/50 border-zinc-700 text-zinc-500'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${sequence.length > 0 ? 'fill-current' : ''}`} />
            <span className="font-bold tracking-widest">{sequence.length > 0 ? 'LIVE TRACE' : 'IDLE'}</span>
          </div>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 relative w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#070709] [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Board Background Details */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        
        {/* Tactical HUD Overlays */}
        <div className="absolute top-6 left-6 text-[10px] text-zinc-600 tracking-[0.2em] hidden lg:block pointer-events-none leading-relaxed">
          INITIATING SCAN...<br/>
          SECURE CHANNEL DETECTED<br/>
          PORT: 8042
        </div>
        <div className="absolute bottom-6 left-6 text-[10px] text-zinc-600 tracking-[0.2em] hidden lg:block pointer-events-none leading-relaxed">
          DECODER: {sequence.length > 0 ? 'ACTIVE' : 'IDLE'}<br/>
          MODE: HW_DIRECT
        </div>
        <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.2em] hidden lg:block text-right pointer-events-none leading-relaxed">
          <span className="text-zinc-600">TARGET LOCK: </span>
          <span className={targetChar !== 'NONE' ? "text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] text-sm" : "text-zinc-500"}>
            '{targetChar}'
          </span><br/>
          <span className="text-red-500/70 drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]">SEQ: {seqString || 'EMPTY'}</span>
        </div>

        {/* Floating Legend */}
        <div className="absolute top-6 right-6 p-3 sm:p-4 bg-[#0a0b0e]/90 backdrop-blur-md border border-zinc-800/80 rounded-lg shadow-xl z-20 flex flex-col gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px] hidden md:flex">
          <div className="text-[9px] sm:text-[10px] text-zinc-500 tracking-widest uppercase mb-1 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <TerminalSquare className="w-3.5 h-3.5" />
            Legend
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-600 bg-zinc-800 shrink-0" />
            <span className="text-xs text-zinc-400">DIT (Short)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-3.5 rounded-sm border-2 border-zinc-600 bg-zinc-800 shrink-0" />
            <span className="text-xs text-zinc-400">DAH (Long)</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-red-400 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] shrink-0" />
            <span className="text-xs text-red-400 font-bold">ACTIVE</span>
          </div>
        </div>

        {/* Circuit Diagram Container */}
        <div className="relative flex-1 w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center p-2 sm:p-8">
          <div className="relative w-[800px] sm:w-full min-w-[800px] max-w-[1200px] aspect-[3/2]">
            {/* SVG Connecting Traces */}
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.filter(n => n.parent).map(node => {
                const parent = nodes.find(n => n.id === node.parent);
                if (!parent) return null;
                
                const isActive = activePath.includes(node.id) && activePath.includes(parent.id);
                const px = getX(parent.x);
                const py = getY(parent.y);
                const cx = getX(node.x);
                const cy = getY(node.y);
                const midY = py + (cy - py) / 2;
                
                return (
                  <g key={`${parent.id}-${node.id}`}>
                    {/* Subtle outer glow for active path */}
                    {isActive && (
                      <path
                        d={`M ${px} ${py} L ${px} ${midY} L ${cx} ${midY} L ${cx} ${cy}`}
                        fill="none"
                        className="stroke-red-500/30 glow-path"
                        strokeWidth="8"
                        strokeLinejoin="round"
                      />
                    )}
                    {/* Main trace */}
                    <path
                      d={`M ${px} ${py} L ${px} ${midY} L ${cx} ${midY} L ${cx} ${cy}`}
                      fill="none"
                      className={`glow-path ${isActive ? "stroke-red-500 animate-pulse-energy" : "stroke-zinc-800"}`}
                      strokeWidth={isActive ? "3" : "2"}
                      strokeLinejoin="round"
                    />
                    {/* Circuit routing vias (corners) */}
                    <circle cx={px} cy={midY} r={isActive ? "2.5" : "2"} className={`glow-node ${isActive ? "fill-red-500 animate-pulse-energy" : "fill-zinc-800"}`} />
                    <circle cx={cx} cy={midY} r={isActive ? "2.5" : "2"} className={`glow-node ${isActive ? "fill-red-500 animate-pulse-energy" : "fill-zinc-800"}`} />
                  </g>
                );
              })}
            </svg>

            {/* HTML Overlay Nodes */}
            {nodes.map(node => {
              const isActive = activePath.includes(node.id);
              return (
                <div
                  key={node.id}
                  className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <NodeShape type={node.type} active={isActive} />
                  {node.label !== 'START' && (
                    <span 
                      className={`absolute top-full mt-2.5 text-[9px] sm:text-[11px] font-bold tracking-widest ${
                        isActive 
                          ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,1)]' 
                          : 'text-zinc-500'
                      }`}
                    >
                      {node.label}
                    </span>
                  )}
                  {node.label === 'START' && (
                    <span 
                      className={`absolute bottom-full mb-3 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] px-1.5 sm:px-2 py-1 rounded bg-zinc-900/80 border ${
                        isActive 
                          ? 'text-red-400 border-red-500/30 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                          : 'text-zinc-500 border-zinc-800'
                      }`}
                    >
                      INPUT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Interactive Controls */}
      <div className="relative px-3 sm:px-6 py-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-center bg-[#0e1015] z-10 gap-2 sm:gap-3">
        <button
          onClick={() => handleInput('dit')}
          disabled={sequence.length >= 4}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-5 py-3 sm:py-2.5 min-h-[48px] bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 rounded shadow-md transition-all active:scale-95"
        >
          <div className="w-3 h-3 rounded-full bg-zinc-300" />
          <span className="font-bold tracking-widest text-zinc-300 text-xs sm:text-sm">DOT</span>
        </button>

        <button
          onClick={() => handleInput('dah')}
          disabled={sequence.length >= 4}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-5 py-3 sm:py-2.5 min-h-[48px] bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 rounded shadow-md transition-all active:scale-95"
        >
          <div className="w-5 h-3 rounded-sm bg-zinc-300" />
          <span className="font-bold tracking-widest text-zinc-300 text-xs sm:text-sm">DASH</span>
        </button>

        <div className="w-full sm:w-px h-px sm:h-8 bg-zinc-800 my-1 sm:my-0 sm:mx-2 hidden sm:block"></div>

        <button
          onClick={handleSave}
          disabled={targetChar === 'NONE'}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-5 py-3 sm:py-2.5 min-h-[48px] bg-emerald-950/30 hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-900/50 rounded shadow-md transition-all active:scale-95"
          title="Save Letter (Enter)"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span className="font-bold tracking-widest text-xs sm:text-sm">SAVE</span>
        </button>

        <button
          onClick={handleSpace}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-5 py-3 sm:py-2.5 min-h-[48px] bg-blue-950/30 hover:bg-blue-900/40 text-blue-400 border border-blue-900/50 rounded shadow-md transition-all active:scale-95"
          title="Add Space (Spacebar)"
        >
          <SpaceIcon className="w-4 h-4" />
          <span className="font-bold tracking-widest text-xs sm:text-sm">SPACE</span>
        </button>

        <div className="w-full sm:flex-1 min-w-[20px] hidden sm:block"></div>

        <button
          onClick={handleReset}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-3 sm:py-2.5 min-h-[48px] bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded shadow-md transition-all active:scale-95 mt-1 sm:mt-0"
          title="Reset Sequence (Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-bold tracking-widest text-sm sm:text-xs">RESET</span>
        </button>
      </div>
    </div>
  );
}

function NodeShape({ type, active }: { type: string, active: boolean }) {
  if (type === 'root') {
    return (
      <div className={`w-4 h-4 rotate-45 border-2 transition-all duration-300 ${
        active 
          ? 'border-red-400 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] scale-110 animate-pulse-energy' 
          : 'border-zinc-500 bg-zinc-800'
      }`} />
    );
  }
  
  if (type === 'dit') {
    return (
      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
        active 
          ? 'border-red-400 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] scale-110 animate-pulse-energy' 
          : 'border-zinc-600 bg-zinc-900'
      }`} />
    );
  }
  
  if (type === 'dah') {
    return (
      <div className={`w-6 h-3.5 rounded-sm border-2 transition-all duration-300 ${
        active 
          ? 'border-red-400 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] scale-110 animate-pulse-energy' 
          : 'border-zinc-600 bg-zinc-900'
      }`} />
    );
  }

  return null;
}
