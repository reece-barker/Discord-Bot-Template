module.exports = {
    _id: 'kick',
    _is: false,
    description: 'Kicks a specified player from the guild with the included reason.',
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You do not have the permission to do this.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!args[0]) {
            return message.reply("Please provide a member to kick.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!message.mentions.members.first()) {
            return message.reply("Couldn't find that person.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (message.mentions.members.first().hasPermission("KICK_MEMBERS") || message.mentions.members.first().user.bot) {
            return message.reply("Can't kick that member.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!args[1]) {
            return message.reply("Please provide a reason for the kick.").then(m => m.delete({
                timeout: 5000
            }));
        }

        message.mentions.members.first().kick(args[1].toString).then(kicked => message.reply(`Successfully kicked ${kicked}`))
    }
}