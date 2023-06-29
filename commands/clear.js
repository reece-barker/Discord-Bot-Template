module.exports = {
    _id: 'clear',
    _is: true,
    _ids: [],
    description: 'Clears the channel of the specified amount of messages.',
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You do not have the permission to do this.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Yeah.... That's not a number? I also can't delete 0 messages by the way.").then(m => m.delete({
                timeout: 5000
            }));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Sorry.... I can't delete messages.").then(m => m.delete({
                timeout: 5000
            }));
        }

        const _limit = 100;

        const _amount = parseInt(args[0]) >= _limit ? _limit : parseInt(args[0]);

        message.channel.bulkDelete(_amount, true)
            .then(deleted => message.reply(`\`${deleted.size}\` messages deleted.`))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }
}