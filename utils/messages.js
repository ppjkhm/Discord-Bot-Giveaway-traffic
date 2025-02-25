const config = require('../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    giveaway: (config.everyoneMention ? "@everyone\n\n" : "")+" **GIVEAWAY** 🎉",
    giveawayEnded: (config.everyoneMention ? "@everyone\n\n" : "")+"**FIN DU GIVEAWAY** 🎉",
    title: '{this.prize}',
    inviteToParticipate: 'Réagis pour participer 🎉!',
    winMessage: '', 
    drawing: 'Tirage : {timestamp}',
    dropMessage: 'Sois le premier à réagir avec 🎉 !',
    embedFooter: '{this.winnerCount} gagnant(s)',
    noWinner: 'Giveaway annulé, pas de participations valides.',
    winners: 'Gagnant(s) :',
    endedAt: 'Terminé à',
    hostedBy: 'Organisé par : {this.hostedBy}'
};