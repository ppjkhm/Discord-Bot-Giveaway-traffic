const Discord = require('discord.js');

module.exports = {

    description: 'Terminer un giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway à terminer (ID du message ou prix du giveaway)',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: ':x: T\'as besoin des permissions de gestion des messages pour terminer des giveaways.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        const giveaway = 
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `'+ query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Ce giveaway est déjà terminé.',
                ephemeral: true
            });
        }

        client.giveawaysManager.end(giveaway.messageId)
        .then(() => {
            interaction.reply('Giveaway terminé !');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });

    }
};