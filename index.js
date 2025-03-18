const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const backendUrl = process.env.BACKEND_URL; // Fetching from Render Env Variables

bot.start((ctx) => ctx.reply('Ajura AI is active! Send a message to begin.'));

bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;

    try {
        const response = await axios.post(backendUrl, {
            message: userMessage,
            user: ctx.from.id
        });

        ctx.reply(response.data.reply);
    } catch (error) {
        console.error('Error:', error.message);
        ctx.reply('Sorry, there was an error processing your request.');
    }
});

bot.launch();
console.log('Ajura bot is running...');
