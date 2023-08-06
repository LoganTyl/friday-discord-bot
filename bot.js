// Passing in dotenv npm package and configuring it so .env variables can be accessed
require('dotenv').config();
const { Client, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const cron = require('cron');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds
]});

const objEnv = process.env;
const file = new AttachmentBuilder('./attachments/f-f-friday.png')

// c is shorthand for already defined client
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)

    // Play every Friday at 11:00am
    // Check if cron syntax is correct here (doesn't account for seconds): https://crontab.guru/
    // Check timezone here: https://momentjs.com/timezone/
    
    let scheduledMessage = new cron.CronJob('0 0 8 * * */5', () => {
        const server = client.guilds.cache.get(objEnv.SERVER_ID);
        const channel = server.channels.cache.get(objEnv.CHANNEL_ID);

        const fridayEmbed = new EmbedBuilder()
            .setTitle("It's Friday woooo")
            .setImage('attachment://friday.png')

        channel.send({
            embeds: [fridayEmbed],
            files: [file]
        })
    },
    null, true, 'America/Los_Angeles'
    )});

// Log in to Discord with client's token
client.login(objEnv.DISCORD_TOKEN)