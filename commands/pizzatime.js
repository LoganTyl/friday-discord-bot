const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('pizzatime').setDescription('Sends a video of the Pizza Time theme from Spiderman'),
    async execute(interaction) {
        await interaction.reply('https://www.youtube.com/watch?v=czTksCF6X8Y');
    }
}