require('dotenv').config({ path: '../.env' }); // try to read from root if exists
const TelegramBot = require('node-telegram-bot-api');
const { generateAvatarBuffer, themes } = require('./generate');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("BOT_TOKEN is not defined in environment variables.");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// We store user states to remember their current settings
// user_id -> { domain, theme, glass, logo }
const userStates = {};

function getUserState(chatId) {
  if (!userStates[chatId]) {
    userStates[chatId] = {
      domain: '7288.ton',
      theme: 0,
      glass: true,
      logo: true,
      messageId: null // to track which message has the inline keyboard
    };
  }
  return userStates[chatId];
}

function getKeyboard(state) {
  return {
    inline_keyboard: [
      [
        { text: `🎨 Theme: ${themes[state.theme].name}`, callback_data: 'next_theme' },
        { text: '🎲 Random', callback_data: 'random_theme' }
      ],
      [
        { text: `🔳 Glass: ${state.glass ? 'ON' : 'OFF'}`, callback_data: 'toggle_glass' },
        { text: `💎 Logo: ${state.logo ? 'ON' : 'OFF'}`, callback_data: 'toggle_logo' }
      ],
      [
        { text: '🔄 Regenerate', callback_data: 'regenerate' }
      ]
    ]
  };
}

// Generate and send/edit avatar
async function sendAvatar(chatId, state, action = 'send') {
  try {
    const buffer = generateAvatarBuffer(state.domain, state.theme, state.glass, state.logo);
    
    if (action === 'send') {
      const msg = await bot.sendPhoto(chatId, buffer, {
        caption: `💎 Avatar for **${state.domain}**\n\nUse inline buttons to customize.`,
        parse_mode: 'Markdown',
        reply_markup: getKeyboard(state)
      });
      state.messageId = msg.message_id;
    } else if (action === 'edit' && state.messageId) {
      // Sometimes editMessageMedia with buffers is tricky in node-telegram-bot-api.
      // Easiest reliable way: delete old and send new.
      try {
        await bot.deleteMessage(chatId, state.messageId);
      } catch (e) {
        // ignore if can't delete
      }
      
      const msg = await bot.sendPhoto(chatId, buffer, { 
  caption: `💎 Avatar for **${state.domain}**`,
  parse_mode: 'Markdown',
  reply_markup: getKeyboard(state)
}, {
  // Add these file options!
  filename: 'avatar.png',
  contentType: 'image/png'
});
      state.messageId = msg.message_id;
    }
  } catch (error) {
    console.error("Error sending avatar:", error);
    bot.sendMessage(chatId, "❌ Error generating avatar.");
  }
}

// Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `💎 *Welcome to TON Avatar Bot!*\n\nUse /avatar <domain> to generate an avatar.\nIf you don't specify a domain, we will generate one for *7288.ton*.\n\nExample:\n\`/avatar myname.ton\``, { parse_mode: 'Markdown' });
});

bot.onText(/\/avatar(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1] || '7288.ton';
  
  const state = getUserState(chatId);
  state.domain = domain;
  
  // We send a new one
  sendAvatar(chatId, state, 'send');
});

// Inline callbacks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const state = getUserState(chatId);

  // If callback is from an older message, we still update the state but edit that specific message.
  state.messageId = query.message.message_id;

  if (data === 'next_theme') {
    state.theme = (state.theme + 1) % themes.length;
  } else if (data === 'random_theme') {
    state.theme = Math.floor(Math.random() * themes.length);
  } else if (data === 'toggle_glass') {
    state.glass = !state.glass;
  } else if (data === 'toggle_logo') {
    state.logo = !state.logo;
  } else if (data === 'regenerate') {
    // Just re-draw with current settings
  }

  // Acknowledge callback
  bot.answerCallbackQuery(query.id);

  // Edit message with new image
  await sendAvatar(chatId, state, 'edit');
});

console.log("🤖 TON Avatar Bot is running...");
