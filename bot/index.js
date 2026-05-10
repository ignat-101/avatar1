/**
 * TON Avatar Telegram Bot
 * 
 * Генерирует аватары прямо в диалоге Telegram — без TMA.
 * 
 * Требования:
 *   npm install telegraf canvas dotenv
 * 
 * Запуск:
 *   BOT_TOKEN=ваш_токен node index.js
 *   — или создайте .env файл с BOT_TOKEN=...
 */

require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// ─── Конфигурация ────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не задан! Создайте .env файл или передайте через переменную окружения.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ─── Темы ────────────────────────────────────────────────────────────────────

const themes = [
  {
    id: 'ton-blue',
    name: '💎 TON Blue',
    bg1: '#3b82f6', bg2: '#4f46e5',
    textColor: '#ffffff',
    glassColor: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'dark-mesh',
    name: '🌑 Dark Mesh',
    bg1: '#0f172a', bg2: '#27272a',
    textColor: '#ffffff',
    glassColor: 'rgba(255,255,255,0.06)',
  },
  {
    id: 'neon-cyber',
    name: '💜 Neon Cyber',
    bg1: '#c026d3', bg2: '#4c1d95',
    textColor: '#fdf4ff',
    glassColor: 'rgba(192,38,211,0.12)',
  },
  {
    id: 'holographic',
    name: '🌈 Holographic',
    bg1: '#f9a8d4', bg2: '#818cf8',
    textColor: '#1e1b4b',
    glassColor: 'rgba(255,255,255,0.35)',
  },
  {
    id: 'deep-space',
    name: '🚀 Deep Space',
    bg1: '#020617', bg2: '#1e1b4b',
    textColor: '#f3e8ff',
    glassColor: 'rgba(88,28,135,0.22)',
  },
  {
    id: 'minimal-light',
    name: '⬜ Minimal Light',
    bg1: '#f4f4f5', bg2: '#d4d4d8',
    textColor: '#18181b',
    glassColor: 'rgba(255,255,255,0.65)',
  },
  {
    id: 'matrix-web3',
    name: '🟢 Matrix Web3',
    bg1: '#022c22', bg2: '#064e3b',
    textColor: '#34d399',
    glassColor: 'rgba(6,78,59,0.22)',
  },
  {
    id: 'molten-gold',
    name: '🥇 Molten Gold',
    bg1: '#f59e0b', bg2: '#ea580c',
    textColor: '#451a03',
    glassColor: 'rgba(255,255,255,0.22)',
  },
];

const getTheme = (id) => themes.find((t) => t.id === id) || themes[0];
const randomTheme = () => themes[Math.floor(Math.random() * themes.length)];

// ─── Генерация аватара на Canvas ──────────────────────────────────────────────

const SIZE = 1024;

/**
 * Рисует обводочный TON-логотип (как на фото: круг + outlined diamond/arrow)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx  - центр X
 * @param {number} cy  - центр Y
 * @param {number} r   - радиус внешнего круга
 * @param {string} color
 */
function drawTonLogo(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Внешний круг
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Diamond/Arrow shape (outlined, как на фото)
  const hw = r * 0.55; // half-width
  const topY = cy - r * 0.35;
  const botY = cy + r * 0.48;
  const midY = cy + r * 0.10;

  // Outer trapezoid (top-flat, V-bottom)
  ctx.beginPath();
  ctx.moveTo(cx - hw, topY);         // top-left
  ctx.lineTo(cx + hw, topY);         // top-right
  ctx.lineTo(cx, botY);              // bottom point
  ctx.closePath();
  ctx.stroke();

  // Inner line — vertical centre line of the T-shape
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, midY);
  ctx.stroke();

  ctx.restore();
}

/**
 * Основная функция генерации аватара
 */
function generateAvatar({ name = 'my.ton', themeId = 'ton-blue', glassmorphism = true, showLogo = true, rounded = 'circle' } = {}) {
  const theme = getTheme(themeId);
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // ── 1. Фон — градиент ──
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, theme.bg1);
  grad.addColorStop(1, theme.bg2);

  // Скругление фона
  const br = rounded === 'circle' ? SIZE / 2 : rounded === 'rounded' ? SIZE * 0.18 : 0;
  ctx.beginPath();
  if (br > 0) {
    ctx.moveTo(br, 0);
    ctx.lineTo(SIZE - br, 0);
    ctx.arcTo(SIZE, 0, SIZE, br, br);
    ctx.lineTo(SIZE, SIZE - br);
    ctx.arcTo(SIZE, SIZE, SIZE - br, SIZE, br);
    ctx.lineTo(br, SIZE);
    ctx.arcTo(0, SIZE, 0, SIZE - br, br);
    ctx.lineTo(0, br);
    ctx.arcTo(0, 0, br, 0, br);
  } else {
    ctx.rect(0, 0, SIZE, SIZE);
  }
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // ── 2. Texture overlay (шум) ──
  ctx.save();
  ctx.clip();

  // Белое пятно сверху-справа (glow)
  const glowGrad1 = ctx.createRadialGradient(SIZE * 0.8, SIZE * 0.1, 0, SIZE * 0.8, SIZE * 0.1, SIZE * 0.5);
  glowGrad1.addColorStop(0, 'rgba(255,255,255,0.15)');
  glowGrad1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowGrad1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Тёмное пятно снизу-слева
  const glowGrad2 = ctx.createRadialGradient(SIZE * 0.1, SIZE * 0.9, 0, SIZE * 0.1, SIZE * 0.9, SIZE * 0.6);
  glowGrad2.addColorStop(0, 'rgba(0,0,0,0.18)');
  glowGrad2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad2;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.restore();

  // ── 3. Glassmorphism карточка ──
  const cardSize = SIZE * 0.6;
  const cardX = (SIZE - cardSize) / 2;
  const cardY = (SIZE - cardSize) / 2;
  const cardR = SIZE * 0.08;

  if (glassmorphism) {
    ctx.save();
    // Скруглённый прямоугольник
    ctx.beginPath();
    ctx.moveTo(cardX + cardR, cardY);
    ctx.lineTo(cardX + cardSize - cardR, cardY);
    ctx.arcTo(cardX + cardSize, cardY, cardX + cardSize, cardY + cardR, cardR);
    ctx.lineTo(cardX + cardSize, cardY + cardSize - cardR);
    ctx.arcTo(cardX + cardSize, cardY + cardSize, cardX + cardSize - cardR, cardY + cardSize, cardR);
    ctx.lineTo(cardX + cardR, cardY + cardSize);
    ctx.arcTo(cardX, cardY + cardSize, cardX, cardY + cardSize - cardR, cardR);
    ctx.lineTo(cardX, cardY + cardR);
    ctx.arcTo(cardX, cardY, cardX + cardR, cardY, cardR);
    ctx.closePath();

    // Glass fill
    ctx.fillStyle = theme.glassColor;
    ctx.fill();

    // Glass border
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // ── 4. TON Логотип ──
  if (showLogo) {
    const logoCX = SIZE / 2;
    const logoCY = cardY + cardSize * 0.22;
    const logoR = cardSize * 0.13;
    drawTonLogo(ctx, logoCX, logoCY, logoR, theme.textColor);
  }

  // ── 5. Инициалы ──
  const initials = name
    .replace(/\.ton$/i, '')
    .substring(0, 2)
    .toUpperCase() || 'TN';

  const fontSize = initials.length > 1 ? SIZE * 0.26 : SIZE * 0.32;
  ctx.font = `bold ${fontSize}px "DejaVu Sans", Arial, sans-serif`;
  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Text shadow
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillText(initials, SIZE / 2, SIZE / 2 + SIZE * 0.02);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // ── 6. Имя снизу ──
  const displayName = name || 'TON Domain';
  const nameFontSize = SIZE * 0.048;
  ctx.font = `600 ${nameFontSize}px "DejaVu Sans", Arial, sans-serif`;
  ctx.fillStyle = theme.textColor;
  ctx.globalAlpha = 0.8;
  ctx.fillText(displayName.toUpperCase(), SIZE / 2, cardY + cardSize - SIZE * 0.065);
  ctx.globalAlpha = 1;

  return canvas.toBuffer('image/png');
}

// ─── Состояние пользователей ──────────────────────────────────────────────────

const userState = new Map(); // userId → { themeId, name, glassmorphism, showLogo, rounded }

function getUserState(userId) {
  if (!userState.has(userId)) {
    userState.set(userId, {
      themeId: 'ton-blue',
      name: 'my.ton',
      glassmorphism: true,
      showLogo: true,
      rounded: 'circle',
    });
  }
  return userState.get(userId);
}

// ─── Клавиатуры ───────────────────────────────────────────────────────────────

function mainKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🎨 Создать аватар', 'gen_avatar'),
      Markup.button.callback('🎲 Случайный', 'gen_random'),
    ],
    [
      Markup.button.callback('🖼 Выбрать тему', 'show_themes'),
      Markup.button.callback('⚙️ Настройки', 'show_settings'),
    ],
    [Markup.button.callback('❓ Помощь', 'show_help')],
  ]);
}

function themesKeyboard() {
  const rows = [];
  for (let i = 0; i < themes.length; i += 2) {
    const row = [Markup.button.callback(themes[i].name, `theme_${themes[i].id}`)];
    if (themes[i + 1]) row.push(Markup.button.callback(themes[i + 1].name, `theme_${themes[i + 1].id}`));
    rows.push(row);
  }
  rows.push([Markup.button.callback('« Назад', 'back_main')]);
  return Markup.inlineKeyboard(rows);
}

function settingsKeyboard(state) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(
      state.glassmorphism ? '✅ Glassmorphism: ВКЛ' : '⬜ Glassmorphism: ВЫКЛ',
      'toggle_glass'
    )],
    [Markup.button.callback(
      state.showLogo ? '✅ TON Лого: ВКЛ' : '⬜ TON Лого: ВЫКЛ',
      'toggle_logo'
    )],
    [Markup.button.callback(`🔲 Форма: ${state.rounded === 'square' ? 'Квадрат' : state.rounded === 'rounded' ? 'Скруглён' : 'Круг'}`, 'toggle_rounded')],
    [Markup.button.callback('« Назад', 'back_main')],
  ]);
}

// ─── Хелперы ─────────────────────────────────────────────────────────────────

async function sendAvatar(ctx, state) {
  const msg = await ctx.reply('⏳ Генерирую аватар...');
  try {
    const imgBuffer = generateAvatar(state);
    await ctx.replyWithPhoto(
      { source: imgBuffer, filename: `${state.name || 'avatar'}.png` },
      {
        caption: `🎨 *${state.name}*\nТема: ${getTheme(state.themeId).name}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔄 Другая тема', 'show_themes'), Markup.button.callback('🎲 Случайный', 'gen_random')],
          [Markup.button.callback('⚙️ Настройки', 'show_settings'), Markup.button.callback('🏠 Меню', 'back_main')],
        ]),
      }
    );
  } catch (e) {
    console.error('Avatar generation error:', e);
    await ctx.reply('❌ Ошибка генерации аватара. Попробуйте ещё раз.');
  }
  // Удаляем сообщение "Генерирую..."
  try { await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id); } catch (_) {}
}

// ─── Команды ─────────────────────────────────────────────────────────────────

bot.start(async (ctx) => {
  const state = getUserState(ctx.from.id);
  await ctx.replyWithHTML(
    `<b>👋 Привет, ${ctx.from.first_name || 'друг'}!</b>\n\n` +
    `Я <b>TON Avatar Bot</b> — генерирую красивые аватары для твоего TON-домена или любого имени прямо здесь, в диалоге.\n\n` +
    `<b>Что умею:</b>\n` +
    `• Генерировать аватары 1024×1024 PNG\n` +
    `• 8 уникальных тем оформления\n` +
    `• Glassmorphism эффект\n` +
    `• TON логотип (outlined)\n\n` +
    `Выбери действие ниже 👇`,
    mainKeyboard()
  );
});

bot.help(async (ctx) => {
  await ctx.replyWithHTML(
    `<b>❓ Помощь — TON Avatar Bot</b>\n\n` +
    `<b>Команды:</b>\n` +
    `/start — Главное меню\n` +
    `/avatar — Создать аватар (текущие настройки)\n` +
    `/avatar имя.ton — Создать аватар с указанным именем\n` +
    `/random — Случайная тема + аватар\n` +
    `/themes — Выбор темы\n` +
    `/settings — Настройки\n` +
    `/help — Эта справка\n\n` +
    `<b>Инлайн-кнопки:</b>\n` +
    `Используй кнопки под сообщениями для быстрого управления без ввода команд.\n\n` +
    `<b>Как изменить имя:</b>\n` +
    `Просто напиши любое слово или домен .ton в чат, и я запомню его как твоё имя.\n` +
    `Например: <code>vitalik.ton</code>`,
    Markup.inlineKeyboard([[Markup.button.callback('🏠 Главное меню', 'back_main')]])
  );
});

bot.command('avatar', async (ctx) => {
  const state = getUserState(ctx.from.id);
  const parts = ctx.message.text.split(' ');
  if (parts[1]) {
    state.name = parts.slice(1).join(' ').substring(0, 20);
    userState.set(ctx.from.id, state);
  }
  await sendAvatar(ctx, state);
});

bot.command('random', async (ctx) => {
  const state = getUserState(ctx.from.id);
  state.themeId = randomTheme().id;
  userState.set(ctx.from.id, state);
  await sendAvatar(ctx, state);
});

bot.command('themes', async (ctx) => {
  await ctx.reply(
    '🖼 *Выбери тему для аватара:*',
    { parse_mode: 'Markdown', ...themesKeyboard() }
  );
});

bot.command('settings', async (ctx) => {
  const state = getUserState(ctx.from.id);
  await ctx.reply(
    '⚙️ *Настройки аватара:*',
    { parse_mode: 'Markdown', ...settingsKeyboard(state) }
  );
});

// ─── Callback-кнопки ─────────────────────────────────────────────────────────

bot.action('gen_avatar', async (ctx) => {
  await ctx.answerCbQuery('⏳ Генерирую...');
  const state = getUserState(ctx.from.id);
  await sendAvatar(ctx, state);
});

bot.action('gen_random', async (ctx) => {
  await ctx.answerCbQuery('🎲 Случайная тема!');
  const state = getUserState(ctx.from.id);
  state.themeId = randomTheme().id;
  userState.set(ctx.from.id, state);
  await sendAvatar(ctx, state);
});

bot.action('show_themes', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '🖼 *Выбери тему для аватара:*\n\nПосле выбора темы нажми «Создать аватар».',
    { parse_mode: 'Markdown', ...themesKeyboard() }
  );
});

bot.action('show_settings', async (ctx) => {
  await ctx.answerCbQuery();
  const state = getUserState(ctx.from.id);
  await ctx.editMessageText(
    '⚙️ *Настройки аватара:*',
    { parse_mode: 'Markdown', ...settingsKeyboard(state) }
  );
});

bot.action('show_help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '❓ *Помощь — TON Avatar Bot*\n\n' +
    '*Команды:*\n' +
    '/avatar — создать аватар\n' +
    '/random — случайная тема\n' +
    '/themes — выбрать тему\n' +
    '/settings — настройки\n\n' +
    '*Как изменить имя:* просто напиши имя или домен.ton в чат',
    { parse_mode: 'Markdown', ...Markup.inlineKeyboard([[Markup.button.callback('« Назад', 'back_main')]]) }
  );
});

bot.action('back_main', async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.editMessageText(
      '🏠 *Главное меню*\n\nВыбери действие:',
      { parse_mode: 'Markdown', ...mainKeyboard() }
    );
  } catch (_) {
    await ctx.reply('🏠 Главное меню\n\nВыбери действие:', mainKeyboard());
  }
});

// Выбор темы
themes.forEach((theme) => {
  bot.action(`theme_${theme.id}`, async (ctx) => {
    await ctx.answerCbQuery(`${theme.name} выбрана!`);
    const state = getUserState(ctx.from.id);
    state.themeId = theme.id;
    userState.set(ctx.from.id, state);
    await ctx.editMessageText(
      `✅ Тема *${theme.name}* выбрана!\n\nТеперь нажми «Создать аватар» 👇`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🎨 Создать аватар', 'gen_avatar')],
          [Markup.button.callback('🔄 Другая тема', 'show_themes'), Markup.button.callback('🏠 Меню', 'back_main')],
        ]),
      }
    );
  });
});

// Настройки — тоглы
bot.action('toggle_glass', async (ctx) => {
  await ctx.answerCbQuery();
  const state = getUserState(ctx.from.id);
  state.glassmorphism = !state.glassmorphism;
  userState.set(ctx.from.id, state);
  await ctx.editMessageText('⚙️ *Настройки аватара:*', {
    parse_mode: 'Markdown', ...settingsKeyboard(state),
  });
});

bot.action('toggle_logo', async (ctx) => {
  await ctx.answerCbQuery();
  const state = getUserState(ctx.from.id);
  state.showLogo = !state.showLogo;
  userState.set(ctx.from.id, state);
  await ctx.editMessageText('⚙️ *Настройки аватара:*', {
    parse_mode: 'Markdown', ...settingsKeyboard(state),
  });
});

bot.action('toggle_rounded', async (ctx) => {
  await ctx.answerCbQuery();
  const state = getUserState(ctx.from.id);
  state.rounded = state.rounded === 'circle' ? 'rounded' : state.rounded === 'rounded' ? 'square' : 'circle';
  userState.set(ctx.from.id, state);
  await ctx.editMessageText('⚙️ *Настройки аватара:*', {
    parse_mode: 'Markdown', ...settingsKeyboard(state),
  });
});

// ─── Текстовые сообщения — обновление имени ───────────────────────────────────

bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  // Игнорируем команды
  if (text.startsWith('/')) return;

  const state = getUserState(ctx.from.id);
  state.name = text.substring(0, 20);
  userState.set(ctx.from.id, state);

  await ctx.reply(
    `✅ Имя обновлено: *${state.name}*\n\nГенерировать аватар?`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🎨 Создать аватар', 'gen_avatar'), Markup.button.callback('🎲 Случайный', 'gen_random')],
        [Markup.button.callback('🏠 Меню', 'back_main')],
      ]),
    }
  );
});

// ─── Запуск ───────────────────────────────────────────────────────────────────

bot.launch(() => {
  console.log('✅ TON Avatar Bot запущен!');
  console.log('📌 Команды:');
  console.log('   /start    — приветствие');
  console.log('   /avatar   — создать аватар');
  console.log('   /random   — случайная тема');
  console.log('   /themes   — выбрать тему');
  console.log('   /settings — настройки');
  console.log('   /help     — справка');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
