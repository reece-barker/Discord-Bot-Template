module.exports = {
    _id: 'ban',
    _is: false,
    description: 'Bans a specified player from the guild with the included reason.',
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("You do not have the permission to do this.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!args[0]) {
            return message.reply("Please provide a member to ban.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!message.mentions.members.first()) {
            return message.reply("Couldn't find that person.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (message.mentions.members.first().hasPermission("BAN_MEMBERS") || message.mentions.members.first().user.bot) {
            return message.reply("Can't ban that member.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!args[1]) {
            return message.reply("Please provide a reason for the ban.").then(m => m.delete({
                timeout: 5000
            }));
        }

        message.mentions.members.first().ban(args[1].toString).then(banned => message.reply(`Successfully banned ${banned}`))
    }
}