export interface ThemeDef {
  id: string;
  name: string;
  background: string;
  text: string;
  glass: string;
  bgHex: string;      // for bot canvas
  textHex: string;    // for bot canvas
  glassHex: string;   // for bot canvas
}

export const themes: ThemeDef[] = [
  {
    id: 'ton-blue',
    name: '💎 TON Blue',
    background: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
    text: 'text-white',
    glass: 'bg-white/10 border-white/20',
    bgHex: '#2563eb',
    textHex: '#ffffff',
    glassHex: 'rgba(255,255,255,0.1)',
  },
  {
    id: 'dark-mesh',
    name: '🌑 Dark Mesh',
    background: 'bg-gradient-to-tr from-slate-900 via-zinc-900 to-neutral-800',
    text: 'text-white',
    glass: 'bg-white/5 border-white/10',
    bgHex: '#18181b',
    textHex: '#ffffff',
    glassHex: 'rgba(255,255,255,0.05)',
  },
  {
    id: 'neon-cyber',
    name: '💜 Neon Cyber',
    background: 'bg-gradient-to-br from-fuchsia-600 via-purple-700 to-violet-900',
    text: 'text-fuchsia-50',
    glass: 'bg-fuchsia-500/10 border-fuchsia-500/30',
    bgHex: '#7c3aed',
    textHex: '#fdf4ff',
    glassHex: 'rgba(217,70,239,0.1)',
  },
  {
    id: 'holographic',
    name: '🌈 Holographic',
    background: 'bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400',
    text: 'text-indigo-950',
    glass: 'bg-white/30 border-white/40',
    bgHex: '#a855f7',
    textHex: '#1e1b4b',
    glassHex: 'rgba(255,255,255,0.3)',
  },
  {
    id: 'deep-space',
    name: '🚀 Deep Space',
    background: 'bg-gradient-to-b from-black via-purple-950 to-indigo-950',
    text: 'text-purple-100',
    glass: 'bg-purple-900/20 border-purple-500/20',
    bgHex: '#0a0014',
    textHex: '#f3e8ff',
    glassHex: 'rgba(88,28,135,0.2)',
  },
  {
    id: 'minimal-light',
    name: '⬜ Minimal Light',
    background: 'bg-gradient-to-br from-zinc-50 to-zinc-200',
    text: 'text-zinc-900',
    glass: 'bg-white/60 border-black/5',
    bgHex: '#f4f4f5',
    textHex: '#18181b',
    glassHex: 'rgba(255,255,255,0.6)',
  },
  {
    id: 'matrix-web3',
    name: '🟢 Matrix Web3',
    background: 'bg-gradient-to-br from-green-950 via-black to-emerald-950',
    text: 'text-emerald-400',
    glass: 'bg-emerald-900/20 border-emerald-500/30',
    bgHex: '#022c22',
    textHex: '#34d399',
    glassHex: 'rgba(6,78,59,0.2)',
  },
  {
    id: 'molten-gold',
    name: '🥇 Molten Gold',
    background: 'bg-gradient-to-tr from-amber-600 via-yellow-500 to-orange-500',
    text: 'text-amber-950',
    glass: 'bg-white/20 border-white/30',
    bgHex: '#d97706',
    textHex: '#451a03',
    glassHex: 'rgba(255,255,255,0.2)',
  },
];
