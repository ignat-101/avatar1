import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Dices, Bot, Layers, Copy, Check, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes } from './themes';
import { AvatarPreview, cn, TonLogoOutlined } from './components/AvatarPreview';

const BOT_COMMANDS = [
  { cmd: '/start', desc: 'Запустить бота и получить приветствие' },
  { cmd: '/avatar', desc: 'Сгенерировать аватар с именем по умолчанию' },
  { cmd: '/avatar <имя>', desc: 'Сгенерировать аватар с вашим именем (напр. ignat.ton)' },
  { cmd: '/themes', desc: 'Показать все доступные темы' },
  { cmd: '/random', desc: 'Случайная тема + генерация аватара' },
  { cmd: '/help', desc: 'Список команд' },
];

const BOT_CODE_PREVIEW = `// bot/index.js — Telegram Avatar Bot
const { Telegraf, Markup } = require('telegraf');
const { createCanvas } = require('canvas');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    '👋 Привет! Я Avatar Bot!\\n\\n' +
    'Генерирую красивые аватары для TON-доменов.\\n\\n' +
    'Используй команды:\\n' +
    '/avatar — создать аватар\\n' +
    '/random — случайный стиль\\n' +
    '/themes — выбрать тему',
    Markup.inlineKeyboard([
      [Markup.button.callback('🎨 Создать аватар', 'gen_default')],
      [Markup.button.callback('🎲 Случайный', 'gen_random')],
      [Markup.button.callback('🖼 Выбрать тему', 'show_themes')],
    ])
  );
});

bot.command('avatar', async (ctx) => {
  const name = ctx.message.text.split(' ')[1] || 'my.ton';
  const img = await generateAvatar(name, 'ton-blue');
  await ctx.replyWithPhoto({ source: img });
});

bot.launch();`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Скопировано!' : 'Копировать'}
    </button>
  );
}

function BotSetupSection() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Установка Telegram бота</h2>
            <p className="text-sm text-zinc-400">Как запустить бота, который отправляет аватары в чат</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 flex flex-col gap-6 border-t border-white/5 pt-6">

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Получите токен бота</h3>
                  <p className="text-zinc-400 text-sm">Откройте <span className="text-blue-400">@BotFather</span> в Telegram → <code className="bg-white/10 px-1 rounded">/newbot</code> → скопируйте токен.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Клонируйте и установите зависимости</h3>
                  <div className="bg-black/50 rounded-2xl p-4 font-mono text-sm text-emerald-400 relative border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-500 text-xs">bash</span>
                      </div>
                      <CopyButton text={`git clone https://github.com/ignat-101/avatar1.git\ncd avatar1/bot\nnpm install`} />
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed">
{`git clone https://github.com/ignat-101/avatar1.git
cd avatar1/bot
npm install`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Создайте .env файл</h3>
                  <div className="bg-black/50 rounded-2xl p-4 font-mono text-sm text-emerald-400 relative border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-500 text-xs">.env</span>
                      </div>
                      <CopyButton text="BOT_TOKEN=ваш_токен_от_botfather" />
                    </div>
                    <pre className="overflow-x-auto text-xs">BOT_TOKEN=ваш_токен_от_botfather</pre>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Запустите бота</h3>
                  <div className="bg-black/50 rounded-2xl p-4 font-mono text-sm text-emerald-400 relative border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-500 text-xs">bash</span>
                      </div>
                      <CopyButton text="node index.js" />
                    </div>
                    <pre className="overflow-x-auto text-xs">node index.js</pre>
                  </div>
                </div>
              </div>

              {/* Commands table */}
              <div>
                <h3 className="font-semibold text-white mb-3">Команды бота</h3>
                <div className="rounded-2xl overflow-hidden border border-white/5">
                  {BOT_COMMANDS.map((c, i) => (
                    <div
                      key={c.cmd}
                      className={cn(
                        'flex items-start gap-4 px-4 py-3',
                        i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                      )}
                    >
                      <code className="text-blue-400 text-sm font-mono flex-shrink-0 w-48">{c.cmd}</code>
                      <span className="text-zinc-400 text-sm">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code preview */}
              <div>
                <h3 className="font-semibold text-white mb-3">Превью кода бота</h3>
                <div className="bg-black/50 rounded-2xl p-4 font-mono relative border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-500 text-xs">bot/index.js</span>
                    </div>
                    <CopyButton text={BOT_CODE_PREVIEW} />
                  </div>
                  <pre className="overflow-x-auto text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {BOT_CODE_PREVIEW}
                  </pre>
                </div>
              </div>

              {/* Inline buttons preview */}
              <div>
                <h3 className="font-semibold text-white mb-3">Инлайн кнопки в боте</h3>
                <div className="bg-zinc-800/60 rounded-2xl p-5 border border-white/5">
                  <div className="bg-zinc-700/60 rounded-xl p-4 mb-3 max-w-sm">
                    <p className="text-white text-sm">👋 Привет! Я Avatar Bot!</p>
                    <p className="text-zinc-300 text-xs mt-1">Генерирую красивые аватары для TON-доменов. Выбери действие:</p>
                  </div>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <div className="flex gap-2">
                      <div className="flex-1 bg-blue-500/30 border border-blue-500/40 rounded-lg px-3 py-2 text-center text-xs text-blue-300 font-medium">🎨 Создать аватар</div>
                      <div className="flex-1 bg-blue-500/30 border border-blue-500/40 rounded-lg px-3 py-2 text-center text-xs text-blue-300 font-medium">🎲 Случайный</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-blue-500/30 border border-blue-500/40 rounded-lg px-3 py-2 text-center text-xs text-blue-300 font-medium">🖼 Темы</div>
                      <div className="flex-1 bg-blue-500/30 border border-blue-500/40 rounded-lg px-3 py-2 text-center text-xs text-blue-300 font-medium">❓ Помощь</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.slice(0,4).map(t => (
                        <div key={t.id} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-xs text-zinc-300">{t.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [name, setName] = useState('ignat.ton');
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id);
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [rounded, setRounded] = useState(16);
  const [isDownloading, setIsDownloading] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0];

  const handleDownload = useCallback(() => {
    if (!avatarRef.current) return;
    setIsDownloading(true);
    toPng(avatarRef.current, { cacheBust: true, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${name || 'avatar'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(console.error)
      .finally(() => setIsDownloading(false));
  }, [avatarRef, name]);

  const handleRandomize = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setActiveThemeId(randomTheme.id);
    setGlassmorphism(Math.random() > 0.3);
    setShowLogo(Math.random() > 0.3);
    setRounded(Math.random() > 0.5 ? 16 : Math.random() > 0.5 ? 50 : 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col gap-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <TonLogoOutlined className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">TON Avatar Studio</h1>
              <p className="text-zinc-500 text-sm">Telegram Bot + Web Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Bot Ready
            </div>
            <a
              href="https://github.com/ignat-101/avatar1"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors border border-white/5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Avatar Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 w-full max-w-[460px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full relative group"
            >
              <div className={cn('absolute -inset-3 rounded-[2rem] opacity-25 blur-2xl transition-all duration-1000', activeTheme.background)} />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-3xl">
                <AvatarPreview
                  ref={avatarRef}
                  name={name}
                  theme={activeTheme}
                  glassmorphism={glassmorphism}
                  showLogo={showLogo}
                  rounded={rounded}
                />
              </div>
            </motion.div>

            {/* Download button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Генерация...' : 'Скачать PNG'}
            </motion.button>
          </div>

          {/* Right: Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl flex flex-col gap-7"
            >
              {/* Name input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                  Имя / TON домен
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium placeholder:text-zinc-600"
                    placeholder="e.g. vitalik.ton"
                    maxLength={20}
                  />
                  {name && (
                    <button
                      onClick={() => setName('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Theme selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                    Тема
                  </label>
                  <button
                    onClick={handleRandomize}
                    className="text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-zinc-300 transition-colors flex items-center gap-1.5"
                  >
                    <Dices className="w-3 h-3" />
                    Случайная
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {themes.map((theme) => {
                    const isActive = activeThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setActiveThemeId(theme.id)}
                        className={cn(
                          'relative group/btn flex flex-col items-start gap-2 p-3 rounded-2xl border text-left transition-all duration-200',
                          isActive
                            ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
                        )}
                      >
                        <div className={cn('w-full h-8 rounded-lg', theme.background)} />
                        <span className={cn('text-xs font-medium leading-tight', isActive ? 'text-white' : 'text-zinc-400')}>
                          {theme.name}
                        </span>
                        {isActive && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Glassmorphism */}
                <button
                  onClick={() => setGlassmorphism((g) => !g)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all',
                    glassmorphism
                      ? 'border-blue-500/40 bg-blue-500/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:bg-white/5'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', glassmorphism ? 'bg-blue-500/20' : 'bg-white/5')}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Glassmorphism</div>
                    <div className="text-xs opacity-60">{glassmorphism ? 'Вкл' : 'Выкл'}</div>
                  </div>
                </button>

                {/* Show Logo */}
                <button
                  onClick={() => setShowLogo((l) => !l)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all',
                    showLogo
                      ? 'border-blue-500/40 bg-blue-500/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:bg-white/5'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', showLogo ? 'bg-blue-500/20' : 'bg-white/5')}>
                    <TonLogoOutlined className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">TON Лого</div>
                    <div className="text-xs opacity-60">{showLogo ? 'Показать' : 'Скрыть'}</div>
                  </div>
                </button>

                {/* Rounded */}
                <button
                  onClick={() => setRounded((r) => (r === 0 ? 16 : r === 16 ? 50 : 0))}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-zinc-400 hover:bg-white/5 text-left transition-all"
                >
                  <div
                    className="w-9 h-9 bg-white/10 border border-white/20 flex-shrink-0"
                    style={{ borderRadius: `${rounded}%` }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Скругление</div>
                    <div className="text-xs opacity-60">
                      {rounded === 0 ? 'Квадрат' : rounded === 16 ? 'Скруглён' : 'Круг'}
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Bot info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-400" />
                <h2 className="text-white font-bold text-lg">Telegram Бот</h2>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">Python / Node.js</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Бот работает <strong className="text-white">без TMA</strong> — только через обычный диалог в Telegram.
                Пользователь пишет команду, выбирает тему через инлайн-кнопки, и бот сразу присылает готовую аватарку как фото.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: '💬', label: 'Команды', sub: '/avatar, /random' },
                  { icon: '🔘', label: 'Инлайн кнопки', sub: 'Выбор темы' },
                  { icon: '🖼', label: 'Фото ответ', sub: '1024×1024 PNG' },
                ].map((f) => (
                  <div key={f.label} className="bg-black/20 rounded-2xl p-3">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="text-white text-xs font-semibold">{f.label}</div>
                    <div className="text-zinc-400 text-xs">{f.sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bot setup guide */}
        <BotSetupSection />
      </div>
    </div>
  );
}
