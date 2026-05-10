import { useState } from 'react';
import { AvatarCanvas } from './AvatarCanvas';
import { Theme } from './avatar-renderer';
import { 
  Palette, 
  Layers, 
  Diamond, 
  Dices, 
  RefreshCw,
  Send,
  MessageSquare
} from 'lucide-react';
import clsx from 'clsx';

const themes: { id: Theme; label: string; icon: string }[] = [
  { id: 'midnight', label: 'Midnight', icon: '🌑' },
  { id: 'opal', label: 'Opal', icon: '⚪' },
  { id: 'nordic', label: 'Nordic', icon: '❄️' },
  { id: 'sunset', label: 'Sunset', icon: '🌇' },
  { id: 'ton-clean', label: 'TON Blue', icon: '💎' },
];

export default function App() {
  const [name, setName] = useState('ignat.ton');
  const [theme, setTheme] = useState<Theme>('midnight');
  const [glass, setGlass] = useState(true);
  const [logo, setLogo] = useState(true);
  const [inputVal, setInputVal] = useState('');

  const handleRandomize = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)].id;
    setTheme(randomTheme);
    setGlass(Math.random() > 0.5);
    setLogo(Math.random() > 0.5);
  };

  const currentThemeData = themes.find(t => t.id === theme);

  return (
    <div className="min-h-screen bg-[#0e1621] text-white font-sans flex items-center justify-center p-4 selection:bg-[#2b5278]">
      {/* Phone Mockup / Telegram Chat Container */}
      <div className="w-full max-w-md bg-[#17212b] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col h-[85vh] relative">
        
        {/* Header */}
        <div className="bg-[#17212b] px-4 py-3 flex items-center gap-3 border-b border-black/20 z-10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl">
            💎
          </div>
          <div>
            <h1 className="font-semibold text-[15px] leading-tight text-[#f5f5f5]">TON Avatar Bot</h1>
            <p className="text-[#8a9aa9] text-[13px]">bot</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 custom-scrollbar relative"
             style={{ 
               backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", 
               backgroundColor: "#0e1621" 
             }}>
             
          <div className="flex flex-col items-center justify-center text-center mt-4 mb-6">
            <span className="bg-[#2b5278]/40 text-[#8a9aa9] text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Today
            </span>
          </div>

          {/* Bot Message Block */}
          <div className="flex gap-2 w-full max-w-[320px] mx-auto group">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-sm shadow-sm">
              💎
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              {/* Main Message Bubble */}
              <div className="bg-[#182533] p-1.5 rounded-2xl rounded-tl-sm shadow-md overflow-hidden flex flex-col">
                <div className="relative group/canvas">
                  <AvatarCanvas 
                    name={name} 
                    theme={theme} 
                    glass={glass} 
                    logo={logo}
                    className="w-full aspect-square transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white/80 font-medium opacity-0 group-hover/canvas:opacity-100 transition-opacity pointer-events-none">
                    1200x1200px PNG
                  </div>
                </div>
                
                <div className="px-3 py-2 text-[14px] text-[#f5f5f5] leading-relaxed">
                  Вот твоя новая минималистичная аватарка! 🎨<br/>
                  Используй кнопки ниже для настройки.
                  <div className="text-right text-[#687c8e] text-[11px] mt-1">
                    14:20
                  </div>
                </div>
              </div>

              {/* Inline Buttons */}
              <div className="flex flex-col gap-1 w-full mt-1">
                {/* Row 1 */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      const idx = themes.findIndex(t => t.id === theme);
                      const next = themes[(idx + 1) % themes.length];
                      setTheme(next.id);
                    }}
                    className="flex-1 bg-[#1c2834] hover:bg-[#202e3d] active:bg-[#2b3c4e] transition-colors py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium text-[#f5f5f5] shadow-sm border border-white/[0.02]"
                  >
                    <Palette className="w-4 h-4 text-[#38bdf8]" />
                    <span>{currentThemeData?.icon} {currentThemeData?.label}</span>
                  </button>
                  <button 
                    onClick={handleRandomize}
                    className="flex-none bg-[#1c2834] hover:bg-[#202e3d] active:bg-[#2b3c4e] transition-colors py-2.5 px-4 rounded-xl flex items-center justify-center text-[14px] font-medium text-[#f5f5f5] shadow-sm border border-white/[0.02]"
                  >
                    <Dices className="w-4 h-4 text-[#a78bfa]" />
                  </button>
                </div>
                
                {/* Row 2 */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => setGlass(!glass)}
                    className={clsx(
                      "flex-1 transition-colors py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium shadow-sm border border-white/[0.02]",
                      glass 
                        ? "bg-[#2b5278]/30 text-[#38bdf8]" 
                        : "bg-[#1c2834] text-[#8a9aa9] hover:bg-[#202e3d]"
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Glass: {glass ? 'ON' : 'OFF'}</span>
                  </button>
                  <button 
                    onClick={() => setLogo(!logo)}
                    className={clsx(
                      "flex-1 transition-colors py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium shadow-sm border border-white/[0.02]",
                      logo 
                        ? "bg-[#2b5278]/30 text-[#38bdf8]" 
                        : "bg-[#1c2834] text-[#8a9aa9] hover:bg-[#202e3d]"
                    )}
                  >
                    <Diamond className="w-4 h-4" />
                    <span>Logo: {logo ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Row 3 */}
                <button 
                  onClick={() => {
                    // Trigger a tiny animation or log
                    const nextTheme = themes.find(t => t.id === theme) || themes[0];
                    console.log('Regenerating...', { name, theme: nextTheme.label, glass, logo });
                  }}
                  className="w-full bg-[#1c2834] hover:bg-[#202e3d] active:bg-[#2b3c4e] transition-colors py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium text-[#f5f5f5] shadow-sm border border-white/[0.02]"
                >
                  <RefreshCw className="w-4 h-4 text-[#4ade80]" />
                  <span>Перегенерировать</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Input Area (Mock Message Input) */}
        <div className="absolute bottom-0 w-full bg-[#17212b] border-t border-black/20 p-3 flex gap-2 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
          <button className="p-2 text-[#8a9aa9] hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="/avatar [имя]"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim()) {
                setName(inputVal.replace('/avatar', '').trim() || 'ignat.ton');
                setInputVal('');
              }
            }}
            className="flex-1 bg-[#242f3d] text-[#f5f5f5] rounded-full px-4 py-2 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#2b5278] placeholder-[#8a9aa9]"
          />
          <button 
            onClick={() => {
              if (inputVal.trim()) {
                setName(inputVal.replace('/avatar', '').trim() || 'ignat.ton');
                setInputVal('');
              }
            }}
            className="p-2 text-[#38bdf8] hover:text-[#7dd3fc] transition-colors"
          >
            <Send className="w-6 h-6 ml-1" />
          </button>
        </div>

      </div>

      {/* Intro text on desktop side */}
      <div className="hidden lg:flex flex-col ml-12 max-w-sm">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
          New Avatar UI
        </h2>
        <p className="text-[#8a9aa9] text-lg leading-relaxed mb-6">
          Минималистичный дизайн, плавные градиенты, эффекты стекла и идеальная типографика. 
        </p>
        <div className="space-y-4">
          <div className="bg-[#17212b] p-4 rounded-xl border border-white/5">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#38bdf8]">✦</span> Код для Node.js Canvas
            </h3>
            <p className="text-sm text-[#8a9aa9]">
              Я подготовил функцию <code>drawAvatar</code>, которая использует стандартный API Canvas. Её можно скопировать прямо в бота!
            </p>
          </div>
          <div className="bg-[#17212b] p-4 rounded-xl border border-white/5">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#a78bfa]">✦</span> Инлайн-кнопки
            </h3>
            <p className="text-sm text-[#8a9aa9]">
              Такой вид кнопок можно легко воссоздать в Telegram, используя <code>inline_keyboard</code> с эмодзи.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
