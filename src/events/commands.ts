import { CacheType, ClientEvents, Interaction, Message } from "discord.js"

const name = "interactionCreate" as keyof ClientEvents;

const handler = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        const msg = await interaction.reply("Pong!");
        if (msg instanceof Message) {
            await msg.edit(`Pong! ${msg.createdTimestamp - interaction.createdTimestamp}ms`);
        }
    }
}

export {
    name,
    handler,
}