const Discord = require('discord.js');
const messages = require("../utils/messages");

module.exports = {

    description: 'Lancer un giveaway',

    options: [
        {
            name: 'duration',
            description: 'Combien de minutes le giveaway doit durer',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'winners',
            description: 'Combien de gagnants pour le giveaway',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'Quel est le prix du giveaway',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Le canal où lancer le giveaway',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    run: async (client, interaction) => {

        if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: ':x: T\'as besoin des permissions de gestion des messages pour lancer des giveaways.',
                ephemeral: true
            });
        }
    
        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayDuration = interaction.options.getInteger('duration') * 60000; 
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
        
        if(!giveawayChannel.isTextBased()) {
            return interaction.reply({
                content: ':x: Le canal sélectionné n\'est pas textuel.',
                ephemeral: true
            });
        }

        const giveawayMessage = await client.giveawaysManager.start(giveawayChannel, {
            duration: giveawayDuration,
            prize: giveawayPrize,
            winnerCount: giveawayWinnerCount,
            hostedBy: client.config.hostedBy ? interaction.user : null,
            messages
        });

        interaction.reply(`Giveaway lancé dans ${giveawayChannel} !`);

        const interval = setInterval(async () => {
            const remainingTime = giveawayMessage.endAt - Date.now();
            if (remainingTime <= 0) {
                clearInterval(interval);
                return;
            }
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            const countdown = `${minutes}m ${seconds}s`;
            const embed = new Discord.EmbedBuilder()
                .setTitle(giveawayPrize)
                .setDescription(`Réagis pour participer 🎉!\nTemps restant : ${countdown}`)
                .setColor('#FF0000')
                .setFooter({ text: `${giveawayWinnerCount} gagnant(s)` })
                .setTimestamp(giveawayMessage.endAt);
            await giveawayMessage.edit({ embeds: [embed] });
        }, 5000);
    } 
};