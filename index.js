const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

// Ensure required environment variables are set
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!TELEGRAM_TOKEN || !OPENAI_API_KEY) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

// Initialize Telegram bot
const bot = new Telegraf(TELEGRAM_TOKEN);

// OpenAI API Request Function
async function getOpenAIResponse(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    return "Sorry, I couldn't process your request.";
  }
}

// Handle incoming messages
bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  const chatId = ctx.chat.id;

  console.log(`Received message from ${chatId}: ${userMessage}`);

  const response = await getOpenAIResponse(userMessage);
  await ctx.reply(response);
});

// Start bot
bot.launch().then(() => {
  console.log("Telegram bot started successfully!");
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
