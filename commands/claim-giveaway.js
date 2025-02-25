const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const messages = require('../utils/messages');

const dataDir = path.join(__dirname, '../data');
const dbFilePath = path.join(dataDir, 'userIds.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


let userIds = [];
if (fs.existsSync(dbFilePath)) {
    userIds = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
} else {
    fs.writeFileSync(dbFilePath, JSON.stringify(userIds, null, 2));
}

module.exports = {

    description: 'Terminer un giveaway avec un gagnant spécifié',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway à terminer (ID du message ou prix)',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'Temps',
            description: 'L\'ID de l\'utilisateur qui doit gagner le giveaway',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: T\'as besoin des permissions de gestion des messages pour terminer des giveaways.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');
        const winnerId = interaction.options.getString('winner');

        const giveaway = 
        client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `'+ query + '`. Veuillez vérifier l\'ID ou le prix du giveaway.',
                ephemeral: true
            });
        }

        if (!userIds.includes(winnerId)) {
            userIds.push(winnerId);
            fs.writeFileSync(dbFilePath, JSON.stringify(userIds, null, 2));
        }

        try {
            await client.giveawaysManager.end(giveaway.messageId).catch(error => {
                if (error.message.includes('Giveaway with message Id')) {
                    console.log('Le giveaway est déjà terminé.');
                } else {
                    throw error;
                }
            });

            const channel = client.channels.cache.get(giveaway.channelId);
            const message = await channel.messages.fetch(giveaway.messageId);
            const winMessage = `Félicitations, <@${winnerId}> ! Tu as gagné **${giveaway.prize}** !\n\nGG, tu as 10 minutes pour me DM pour la récompense.`;
            const embed = new Discord.EmbedBuilder()
                .setTitle(giveaway.prize)
                .setDescription(winMessage)
                .setColor('#FF0000')
                .setFooter({ text: `${giveaway.winnerCount} gagnant(s)` })
                .setTimestamp();

            await message.edit({ embeds: [embed] });

            await interaction.reply({
                content: 'Le giveaway a été terminé avec succès.',
                ephemeral: true
            });
        } catch (e) {
            await interaction.reply({
                content: `Une erreur s'est produite : ${e}`,
                ephemeral: true
            });
        }
    }
};