import { execSync } from 'child_process';
const fs = require('fs');

try {
  execSync('curl -sL https://raw.githubusercontent.com/ignat-101/avatar1/main/bot/index.js -o downloaded_bot.js');
  console.log("Downloaded successfully");
} catch (e) {
  console.error(e);
}
