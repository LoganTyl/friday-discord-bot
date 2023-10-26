// Passing in dotenv npm package and configuring it so .env variables can be accessed
require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const cron = require('cron');
const fs = require('node:fs');
const path = require('node:path');

const objEnv = process.env;
const file = new AttachmentBuilder('./attachments/f-f-friday.png');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds
]});

client.commands = new Collection();

const commandDirectory = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandDirectory);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandDirectory, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// c is shorthand for already defined client
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)

    // Play every Friday at 8:00am Pacific Time
    // CronJob format is: '<second> <minute> <hour> <day> <month> <day of the week>'
    // Check if cron syntax is correct here (browser doesn't account for seconds): https://crontab.guru/
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
    )
});

// Runs command if a command is inputted
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) {
        return;
    }

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord with client's token
client.login(objEnv.DISCORD_TOKEN)