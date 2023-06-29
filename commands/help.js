const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    _id: 'help',
    _is: false,
    description: 'Displays this message.',
    run: async (client, message, args, collections) => {
        const embed = new MessageEmbed()
            .setTitle(`These are all the available collections you have permissions too.`)
            .setThumbnail("https://i.imgur.com/SrwdIXZ.png")
            .setColor("#409370");

        collections.forEach(async (collection, i) => {
            if (collection._is) {
                embed.addField(message.content.charAt(0) + collection._id, collection.description);
            }
        });

        return message.channel.send(embed);
    }
}