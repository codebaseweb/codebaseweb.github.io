import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from?.first_name || "друг";
  bot.sendMessage(chatId, `Привет, ${name}! Ты написал: ${msg.text}`);
});