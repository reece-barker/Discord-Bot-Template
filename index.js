const {
    Client,
    Collection,
    WebhookClient,
    MessageEmbed,
    Intents
} = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const process = require('process');
const fs = require('fs');
const readline = require('readline');

const express = require('express');
const www = express();
const http = require('http').createServer(www);

const env = require('./env.json');

// to get the prefix do env.prefix

const dotenv = require('dotenv');
dotenv.config();

const Rules = async () => {
    const Embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('You should make sure your read all of our rules here at {insert community name} before engaging with our community!')
        .setDescription('@everyone')
        .addFields([{
                name: '1',
                value: 'Do not spam/flood channels with messages.',
                inline: false
            },
            {
                name: '2',
                value: 'Do not constantly use the @mentions.',
                inline: false
            },
            {
                name: '3',
                value: 'NSFW content is only allowed in the provided channels.',
                inline: false
            },
            {
                name: '4',
                value: 'DM specific members instead of having 1-1 conversations in the channels.',
                inline: false
            },
            {
                name: '5',
                value: 'Do not request innapropriate musical content.',
                inline: false
            },
            {
                name: '6',
                value: 'Do not post any sensitive information on members... (etc).',
                inline: false
            },
            {
                name: '7',
                value: 'You should be respectful and kind hearted towards fellow members unless you are invoking a little banter.',
                inline: false
            },
            {
                name: '8',
                value: 'You should always be engaged and positive within this community.',
                inline: false
            },
            {
                name: '9',
                value: 'You are not allowed to advertise here, you may post ads that involve looking for groups in our LFG channel.',
                inline: false
            }
        ])
        .setThumbnail(client.guilds.cache.first().iconURL())
        .setFooter(`#${client.guilds.cache.first().id}`)
        .setColor("#14423c");

    client.guilds.cache.first().channels.cache.get('insert channel id').bulkDelete(100, true)
    client.guilds.cache.first().channels.cache.get('insert channel id').send(Embed);
}

client.models = new Collection();
client.commands = new Collection();
client.aliases = new Collection();

const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith(".js"));
let commandGrabbed = [];

for (let file of commandFiles) {
    const command = require(`./commands/${file}`);
    commandGrabbed.push(command.name);
    commandGrabbed.push(command.status);
    commandGrabbed.push(command.description);
    if (command.status === "+ENABLED") {
        client.commands.set(command.name, command);
    }
}

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type != "dm") return;
    if (!message.content.startsWith(env.prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(env.prefix.length).trim().split(/ +/s);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    
    if (command && command.status === "+ENABLED") {
        command.run(client, message, args, commandGrabbed);
    } else {
        message.channel.send("This command has been disabled.");
    }
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(env.prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(env.prefix.length).trim().split(/ +/s);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    
    if (command && command.status === "+ENABLED") {
        command.run(client, message, args, commandGrabbed);
    } else {
        message.channel.send("This command has been disabled.");
    }
});

client.on('ready', async () => {
    if (process.env.MAINTENANCE == true) {
        client.user.setPresence({
            activity: {
                name: `Maintenance`,
                type: 'LISTENING'
            },
            status: 'idle'
        });
    } else {
        client.user.setPresence({
            activity: {
                name: `Discord Bot Template`,
                type: 'LISTENING'
            },
            status: 'online'
        });
    }

    // run Rules() if you want to see a test embed
});

// automatically adds reactions to any messages sent in the server-suggestions channel.

client.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.channel.id == 'INSERT channel id for server suggestions' || message.channel.id == 'INSERT channel id for another channel') {
        message.react('⬆️');
        message.react('⬇️');
    }
});

// logs into the bot

client.login(process.env.TOKEN);

// Website Dashboard

http.listen(process.env.PORT, async () => {
    process.stdout.write(`\nhttp://localhost:${process.env.PORT}/`);
});

www.use(express.json());

www.use(require('cookie-parser')());
www.use(require('body-parser').urlencoded({
    extended: true
}));

www.get('/', async (req, res) => {    
    res.sendFile(__dirname +'/dashboard.html');
});

www.post('/embeds/channel', async (req, res) => {
    const {
        title,
        description,
        footer,
        field1,
        field2,
        field3,
        channelId,
        bulkDelete
    } = req.body;

    const ConstructEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setColor("#14423c");

    if (!channelId) {
        return res.send('No Channel ID!');
    }

    if (client.guilds.cache.first().channels.cache.get(channelId)) {
        if (title) {
            try {
                ConstructEmbed.setTitle(title);
            } catch(err) {
                console.error(err);
            }
        }

        if (description) {
            try {
                ConstructEmbed.setDescription(description);
            } catch(err) {
                console.error(err);
            }
        }

        if (field1) {
            try {
                ConstructEmbed.addField(field1.title, field1.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (field2) {
            try {
                ConstructEmbed.addField(field2.title, field2.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (field3) {
            try {
                ConstructEmbed.addField(field3.title, field3.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (footer) {
            try {
                ConstructEmbed.setFooter(footer);
            } catch(err) {
                console.error(err);
            }
        }

        if (bulkDelete) {
            try {
                client.guilds.cache.first().channels.cache.get(channelId).bulkDelete(100, true);
            } catch(err) {
                console.error(err);
            }
        }

        client.guilds.cache.first().channels.cache.get(channelId).send(ConstructEmbed);
    }

    res.send('Done!');
});

www.post('/embeds/dm', async (req, res) => {
    const {
        title,
        description,
        footer,
        field1,
        field2,
        field3,
        userId,
    } = req.body;

    const ConstructEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setColor("#14423c");

    if (!userId) {
        return res.send('No User ID!');
    }

    if (client.guilds.cache.first().members.cache.get(userId)) {
        if (title) {
            try {
                ConstructEmbed.setTitle(title);
            } catch(err) {
                console.error(err);
            }
        }

        if (description) {
            try {
                ConstructEmbed.setDescription(description);
            } catch(err) {
                console.error(err);
            }
        }

        if (field1) {
            try {
                ConstructEmbed.addField(field1.title, field1.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (field2) {
            try {
                ConstructEmbed.addField(field2.title, field2.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (field3) {
            try {
                ConstructEmbed.addField(field3.title, field3.value, false);
            } catch(err) {
                console.error(err);
            }
        }

        if (footer) {
            try {
                ConstructEmbed.setFooter(footer);
            } catch(err) {
                console.error(err);
            }
        }

        client.guilds.cache.first().members.cache.get(userId).send(ConstructEmbed);
    }

    res.send('Done!');
});