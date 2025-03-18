const TelegramBot = require('node-telegram-bot-api');
const { OpenAI } = require('openai');
const express = require('express');

// Replace with your Telegram Bot Token
const token = process.env.TELEGRAM_BOT_TOKEN;

// Replace with your OpenAI API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a bot instance
const bot = new TelegramBot(token);

// Create an Express app
const app = express();

// Parse JSON bodies
app.use(express.json());

// Set webhook endpoint
app.post(`/webhook/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
