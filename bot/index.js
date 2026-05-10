require('dotenv').config(); // ✅ FIX 3: reads .env from CWD (the bot/ folder)

const TelegramBot = require('node-telegram-bot-api');
const { generateAvatarBuffer, themes } = require('./generate');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('❌ BOT_TOKEN is not defined. Create bot/.env with BOT_TOKEN=...');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Per-user state: domain, theme, glass, logo, messageId
const userStates = {};

function getUserState(chatId) {
  if (!userStates[chatId]) {
    userStates[chatId] = {
      domain: '7288.ton',
      theme: 0,
      glass: true,
      logo: true,
      messageId: null,
    };
  }
  return userStates[chatId];
}

function getKeyboard(state) {
  return {
    inline_keyboard: [
      [
        { text: `🎨 Theme: ${themes[state.theme].name}`, callback_data: 'next_theme' },
        { text: '🎲 Random',                              callback_data: 'random_theme' },
      ],
      [
        { text: `🔳 Glass: ${state.glass ? 'ON' : 'OFF'}`, callback_data: 'toggle_glass' },
        { text: `💎 Logo: ${state.logo  ? 'ON' : 'OFF'}`, callback_data: 'toggle_logo'  },
      ],
      [
        { text: '🔄 Regenerate', callback_data: 'regenerate' },
      ],
    ],
  };
}

async function sendAvatar(chatId, state, action = 'send') {
  try {
    // ✅ FIX 4: generate() now returns JPEG buffer — no black image issue
    const buffer = generateAvatarBuffer(state.domain, state.theme, state.glass, state.logo);

    const opts = {
      caption:      `💎 Avatar for *${state.domain}*\n\nUse inline buttons to customize.`,
      parse_mode:   'Markdown',
      reply_markup: getKeyboard(state),
    };

    if (action === 'send') {
      const msg = await bot.sendPhoto(chatId, buffer, opts);
      state.messageId = msg.message_id;
    } else if (action === 'edit' && state.messageId) {
      // node-telegram-bot-api doesn't support editMessageMedia with buffers well,
      // so delete + resend is the most reliable approach
      try { await bot.deleteMessage(chatId, state.messageId); } catch (_) {}
      const msg = await bot.sendPhoto(chatId, buffer, opts);
      state.messageId = msg.message_id;
    }
  } catch (err) {
    console.error('Error in sendAvatar:', err);
    bot.sendMessage(chatId, '❌ Error generating avatar. Check console.');
  }
}

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `💎 *Welcome to TON Avatar Bot!*

Use /avatar to generate an avatar.
Default domain: *7288.ton*

Example:
\`/avatar myname.ton\``,
    { parse_mode: 'Markdown' }
  );
});

// /avatar [domain]
bot.onText(/\/avatar(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const state  = getUserState(chatId);
  state.domain = (match[1] || '7288.ton').trim();
  sendAvatar(chatId, state, 'send');
});

// Plain text → update domain on the fly
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const state  = getUserState(chatId);
    state.domain = msg.text.trim();
    sendAvatar(chatId, state, 'send');
  }
});

// Inline button callbacks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const state  = getUserState(chatId);
  state.messageId = query.message.message_id;

  switch (query.data) {
    case 'next_theme':
      state.theme = (state.theme + 1) % themes.length;
      break;
    case 'random_theme':
      state.theme = Math.floor(Math.random() * themes.length);
      break;
    case 'toggle_glass':
      state.glass = !state.glass;
      break;
    case 'toggle_logo':
      state.logo = !state.logo;
      break;
    case 'regenerate':
      // keep settings, just redraw
      break;
  }

  await bot.answerCallbackQuery(query.id);
  await sendAvatar(chatId, state, 'edit');
});

console.log('🤖 TON Avatar Bot is running...');
