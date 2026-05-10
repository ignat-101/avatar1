/**
 * TON Avatar Bot — single-file entry point for Render.com
 *
 * Fixes:
 *  1. Webhook mode instead of polling  → eliminates 409 Conflict errors
 *  2. HTTP server on process.env.PORT  → Render detects the open port
 *  3. White background pre-fill before gradient → no black images
 *  4. JPEG output with quality 0.95    → Telegram shows it correctly
 *  5. Canvas drawn synchronously with error guard → no silent failures
 */

'use strict';

require('dotenv').config();

const http    = require('http');
const https   = require('https');
const { URL } = require('url');

// ── canvas ────────────────────────────────────────────────────────────────────
let createCanvas;
try {
  ({ createCanvas } = require('canvas'));
} catch (e) {
  console.error('⚠️  canvas module not found:', e.message);
  process.exit(1);
}

// ── config ────────────────────────────────────────────────────────────────────
const BOT_TOKEN   = process.env.BOT_TOKEN;
const RENDER_URL  = process.env.RENDER_EXTERNAL_URL   // e.g. https://avatar1-kroz.onrender.com
                 || process.env.SERVICE_URL;
const PORT        = parseInt(process.env.PORT || '3000', 10);

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

// ── themes ────────────────────────────────────────────────────────────────────
const themes = [
  { name: 'TON Blue',      bg: ['#0088CC', '#005588'] },
  { name: 'Dark Mesh',     bg: ['#121212', '#2a2a35'] },
  { name: 'Neon Cyber',    bg: ['#0d0221', '#26004c', '#ff0055'] },
  { name: 'Holographic',   bg: ['#e0c3fc', '#8ec5fc'] },
  { name: 'Deep Space',    bg: ['#000000', '#130f40'] },
  { name: 'Minimal Light', bg: ['#fdfbfb', '#ebedee'] },
  { name: 'Matrix Web3',   bg: ['#000000', '#0f3e0f'] },
  { name: 'Molten Gold',   bg: ['#ffb347', '#ffcc33'] },
];

// ── avatar generator ──────────────────────────────────────────────────────────
function generateAvatarBuffer(domain, themeIndex, glass, logo) {
  const width  = 1200;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx    = canvas.getContext('2d');

  const t = themes[themeIndex] || themes[0];

  // Step 0: solid white background — prevents black image when Telegram
  //         decodes a PNG with alpha as JPEG
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Step 1: gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (t.bg.length === 2) {
    gradient.addColorStop(0, t.bg[0]);
    gradient.addColorStop(1, t.bg[1]);
  } else {
    gradient.addColorStop(0,   t.bg[0]);
    gradient.addColorStop(0.5, t.bg[1]);
    gradient.addColorStop(1,   t.bg[2]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Decorative circles
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, width * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.9, width * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = t.name === 'Minimal Light' ? '#000000' : '#ffffff';
  ctx.fill();
  ctx.globalAlpha = 1.0;

  const cx = width  / 2;
  const cy = height / 2;

  // Step 2: Glassmorphism card
  if (glass) {
    const cardWidth  = width  * 0.8;
    const cardHeight = height * 0.45;
    const rx     = cx - cardWidth  / 2;
    const ry     = cy - cardHeight / 2;
    const radius = 40;

    ctx.save();
    ctx.shadowColor   = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur    = 30;
    ctx.shadowOffsetY = 15;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(rx, ry, cardWidth, cardHeight, radius);
    } else {
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + cardWidth - radius, ry);
      ctx.quadraticCurveTo(rx + cardWidth, ry,            rx + cardWidth, ry + radius);
      ctx.lineTo(rx + cardWidth, ry + cardHeight - radius);
      ctx.quadraticCurveTo(rx + cardWidth, ry + cardHeight, rx + cardWidth - radius, ry + cardHeight);
      ctx.lineTo(rx + radius, ry + cardHeight);
      ctx.quadraticCurveTo(rx, ry + cardHeight, rx, ry + cardHeight - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    }

    const cardGrad = ctx.createLinearGradient(rx, ry, rx, ry + cardHeight);
    if (t.name === 'Minimal Light') {
      cardGrad.addColorStop(0, 'rgba(255,255,255,0.7)');
      cardGrad.addColorStop(1, 'rgba(255,255,255,0.4)');
    } else {
      cardGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
      cardGrad.addColorStop(1, 'rgba(255,255,255,0.05)');
    }
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth   = 2;
    ctx.strokeStyle = t.name === 'Minimal Light'
      ? 'rgba(255,255,255,0.8)'
      : 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.restore();
  }

  // Step 3: TON logo (diamond)
  let textY = cy;
  if (logo) {
    const logoSize = glass ? 60 : 80;
    const logoY    = cy - (glass ? 50 : 60);
    textY          = cy + (glass ? 40 : 50);

    ctx.save();
    ctx.translate(cx, logoY);
    ctx.beginPath();
    ctx.moveTo(0,            -logoSize / 2);
    ctx.lineTo( logoSize / 2, -logoSize / 6);
    ctx.lineTo(0,             logoSize / 2);
    ctx.lineTo(-logoSize / 2, -logoSize / 6);
    ctx.closePath();
    ctx.fillStyle = t.name === 'Minimal Light' ? '#0088CC' : '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  // Step 4: Domain text
  let fontSize = glass ? 80 : 100;
  if (domain.length > 12) fontSize = Math.floor(fontSize * 12 / domain.length);

  ctx.font         = `bold ${fontSize}px sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor  = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur   = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle    = t.name === 'Minimal Light' ? '#333333' : '#FFFFFF';
  ctx.fillText(domain, cx, textY);

  // Return JPEG — Telegram renders it perfectly
  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// ── Telegram API helpers ──────────────────────────────────────────────────────
function telegramRequest(method, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: 'api.telegram.org',
      path:     `/bot${BOT_TOKEN}/${method}`,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Send a photo buffer via multipart/form-data */
function sendPhotoBuffer(chatId, buffer, caption, replyMarkup) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(16).slice(2);

    // Build multipart body manually
    const metaFields = [
      { name: 'chat_id',      value: String(chatId) },
      { name: 'caption',      value: caption        },
      { name: 'parse_mode',   value: 'Markdown'     },
      { name: 'reply_markup', value: JSON.stringify(replyMarkup) },
    ];

    let preamble = '';
    for (const f of metaFields) {
      preamble += `--${boundary}\r\nContent-Disposition: form-data; name="${f.name}"\r\n\r\n${f.value}\r\n`;
    }
    preamble += `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="avatar.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const epilogue = `\r\n--${boundary}--\r\n`;

    const preambleBuf = Buffer.from(preamble, 'utf8');
    const epilogueBuf = Buffer.from(epilogue, 'utf8');
    const bodyBuf     = Buffer.concat([preambleBuf, buffer, epilogueBuf]);

    const options = {
      hostname:       'api.telegram.org',
      path:           `/bot${BOT_TOKEN}/sendPhoto`,
      method:         'POST',
      headers: {
        'Content-Type':   `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuf.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(bodyBuf);
    req.end();
  });
}

function sendMessage(chatId, text, extra = {}) {
  return telegramRequest('sendMessage', { chat_id: chatId, text, parse_mode: 'Markdown', ...extra });
}

function answerCallbackQuery(id) {
  return telegramRequest('answerCallbackQuery', { callback_query_id: id });
}

function deleteMessage(chatId, messageId) {
  return telegramRequest('deleteMessage', { chat_id: chatId, message_id: messageId });
}

// ── User state ────────────────────────────────────────────────────────────────
const userStates = {};

function getUserState(chatId) {
  if (!userStates[chatId]) {
    userStates[chatId] = { domain: '7288.ton', theme: 0, glass: true, logo: true, messageId: null };
  }
  return userStates[chatId];
}

function getKeyboard(state) {
  return {
    inline_keyboard: [
      [
        { text: `🎨 Theme: ${themes[state.theme].name}`, callback_data: 'next_theme'   },
        { text: '🎲 Random',                              callback_data: 'random_theme' },
      ],
      [
        { text: `🔳 Glass: ${state.glass ? 'ON' : 'OFF'}`, callback_data: 'toggle_glass' },
        { text: `💎 Logo: ${state.logo  ? 'ON' : 'OFF'}`,  callback_data: 'toggle_logo'  },
      ],
      [
        { text: '🔄 Regenerate', callback_data: 'regenerate' },
      ],
    ],
  };
}

// ── Send / refresh avatar ─────────────────────────────────────────────────────
async function sendAvatar(chatId, state) {
  try {
    const buffer  = generateAvatarBuffer(state.domain, state.theme, state.glass, state.logo);
    const caption = `💎 Avatar for *${state.domain}*\n\nUse inline buttons to customize.`;
    const kb      = getKeyboard(state);

    // Delete previous message if exists
    if (state.messageId) {
      try { await deleteMessage(chatId, state.messageId); } catch (_) {}
      state.messageId = null;
    }

    const result = await sendPhotoBuffer(chatId, buffer, caption, kb);
    if (result.ok) {
      state.messageId = result.result.message_id;
    } else {
      console.error('sendPhoto failed:', result);
      await sendMessage(chatId, '❌ Failed to send avatar. Please try again.');
    }
  } catch (err) {
    console.error('Error in sendAvatar:', err);
    try { await sendMessage(chatId, '❌ Error generating avatar. Check logs.'); } catch (_) {}
  }
}

// ── Update handler ────────────────────────────────────────────────────────────
async function handleUpdate(update) {
  // Callback query (inline buttons)
  if (update.callback_query) {
    const query  = update.callback_query;
    const chatId = query.message.chat.id;
    const state  = getUserState(chatId);
    state.messageId = query.message.message_id;

    switch (query.data) {
      case 'next_theme':   state.theme = (state.theme + 1) % themes.length; break;
      case 'random_theme': state.theme = Math.floor(Math.random() * themes.length); break;
      case 'toggle_glass': state.glass = !state.glass; break;
      case 'toggle_logo':  state.logo  = !state.logo;  break;
      case 'regenerate':   break; // just redraw
    }

    await answerCallbackQuery(query.id);
    await sendAvatar(chatId, state);
    return;
  }

  // Regular message
  if (update.message) {
    const msg    = update.message;
    const chatId = msg.chat.id;
    const text   = msg.text || '';

    if (text.startsWith('/start')) {
      await sendMessage(
        chatId,
        `💎 *Welcome to TON Avatar Bot!*\n\nUse /avatar to generate an avatar.\nDefault domain: *7288.ton*\n\nExample:\n\`/avatar myname.ton\``
      );
      return;
    }

    if (text.startsWith('/avatar')) {
      const parts  = text.split(/\s+/);
      const domain = parts[1] || '7288.ton';
      const state  = getUserState(chatId);
      state.domain = domain.trim();
      await sendAvatar(chatId, state);
      return;
    }

    // Plain text → use as domain
    if (!text.startsWith('/')) {
      const state  = getUserState(chatId);
      state.domain = text.trim();
      await sendAvatar(chatId, state);
      return;
    }
  }
}

// ── Webhook setup ─────────────────────────────────────────────────────────────
async function setupWebhook() {
  if (!RENDER_URL) {
    console.warn('⚠️  RENDER_EXTERNAL_URL not set — webhook cannot be registered automatically.');
    console.warn('    Set RENDER_EXTERNAL_URL env var to your Render service URL, e.g.:');
    console.warn('    https://avatar1-kroz.onrender.com');
    return;
  }

  const webhookUrl = `${RENDER_URL.replace(/\/$/, '')}/webhook/${BOT_TOKEN}`;

  try {
    // Delete any existing webhook / polling first
    await telegramRequest('deleteWebhook', { drop_pending_updates: true });
    console.log('🗑️  Old webhook deleted.');

    const result = await telegramRequest('setWebhook', { url: webhookUrl });
    if (result.ok) {
      console.log(`✅ Webhook set to: ${webhookUrl}`);
    } else {
      console.error('❌ setWebhook failed:', result);
    }
  } catch (err) {
    console.error('❌ Error setting webhook:', err);
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const urlPath = req.url || '/';

  // Health check
  if (urlPath === '/' || urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('TON Avatar Bot is running 🤖');
    return;
  }

  // Webhook endpoint
  if (req.method === 'POST' && urlPath === `/webhook/${BOT_TOKEN}`) {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
      try {
        const update = JSON.parse(body);
        await handleUpdate(update);
      } catch (err) {
        console.error('Error handling update:', err);
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, async () => {
  console.log(`🚀 HTTP server listening on port ${PORT}`);
  await setupWebhook();
  console.log('🤖 TON Avatar Bot is running...');
});
