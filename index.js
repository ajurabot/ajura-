const TelegramBot = require('node-telegram-bot-api');
const { OpenAI } = require('openai');

// Replace with your Telegram Bot Token
const token = process.env.TELEGRAM_BOT_TOKEN;

// Replace with your OpenAI API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! I am your ChatGPT-powered bot. How can I help you today?');
});

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    // Send the user's message to ChatGPT
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    // Send the ChatGPT response back to the user
    bot.sendMessage(chatId, response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
  }
});
