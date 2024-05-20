const {SlashCommandBuilder} = require('discord.js');
const timeRegex = new RegExp(`^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$`, 'i')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule_message')
        .setDescription('Schedule a simple message to send at a designated time in this channel')
        .addStringOption(option => 
            option.setName('your_message')
                .setDescription('The message you would like to be sent')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message_time')
                .setDescription('What time you would like your message sent? (must match HH:MM:SS military time format)')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const your_message = interaction.options.getString('your_message');
        const time = interaction.options.getString('message_time');
        const regexCheck = timeRegex.test(time);

        if(regexCheck){
            await interaction.reply({
                content:
                    `Your message will be sent at ${time}\n\nYour message: ${your_message}`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Your inputted time (${time}) is invalid. Please enter in military time as either HH:MM or HH:MM:SS.`,
                ephemeral: true
            });
        }
    }
}