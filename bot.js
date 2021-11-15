const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, "GUILD_MESSAGES", "GUILD_MEMBERS"] });
const { prefix, token } = require('./config.json');
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.db');
let todoArr = [];

bot.on('ready', async () => {
    console.log(`${bot.user.username} is now online!`);
});

bot.on('messageCreate', async message => {
    if(message.author.bot) return;

    if(message.content.toLowerCase().startsWith(`${prefix}todo list`)) {
        if(message.content.toLowerCase() == `${prefix}todo list`) {
            todoArr = await keyv.get('todo-list'+message.author.id);

            if(todoArr == undefined || todoArr.length == 0) {
                todoArr = [];

                await keyv.set('todo-list'+message.author.id);

                message.channel.send(':x: Your todo list is empty.');
                return;
            }

            message.channel.send(`__**${message.author.username}'s todo list:**__\n ${todoArr.map((item, i) => i + 1 + ". " + item).join("\n")}`);
            return;
        }
    }

    if(message.content.toLowerCase().startsWith(`${prefix}todo add`)) {
        if(message.content.toLowerCase() == `${prefix}todo add`) {
            message.channel.send(':x: Not enough arguments.');
            return;
        }

        todoArr = await keyv.get('todo-list'+message.author.id);

        if(todoArr == undefined) {
            todoArr = [];
        }

        let todoMsg = message.content.substring(prefix.length).split(" ").slice(2).join(" ");
        
        todoArr.push(todoMsg);

        await keyv.set('todo-list'+message.author.id, todoArr);

        message.channel.send(':white_check_mark: Your todo list has been updated.');
        return;
    }

    if(message.content.toLowerCase().startsWith(`${prefix}todo remove`)) {
        if(message.content.toLowerCase() == `${prefix}todo remove`) {
            message.channel.send(':x: Not enough arguments.');
            return;
        }

        todoArr = await keyv.get('todo-list'+message.author.id);

        if(todoArr == undefined) {
            todoArr = [];

            await keyv.set('todo-list'+message.author.id, todoArr);

            message.channel.send(':x: Your todo list is empty.');
            return;
        }

        let removedTodo = message.content.substring(prefix.length).split(" ").slice(2)[0] - 1;

        if(todoArr[removedTodo] == undefined) {
            message.channel.send(":x: That number doesn't exist in your todo list.");
            return;
        } else if(isNaN(removedTodo)) {
            message.channel.send(":x: You have to input a number.");
            return;
        }

        todoArr.splice(removedTodo, 1);

        await keyv.set('todo-list'+message.author.id, todoArr);

        message.channel.send(':white_check_mark: Your todo list has been updated.');
        return;
    }
});

bot.login(token);