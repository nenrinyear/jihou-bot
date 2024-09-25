import { ActivityType, Client, ClientEvents, FetchMessagesOptions } from "discord.js";
import registerCommands from "../register";
import path from "path";

const name = 'ready' as keyof ClientEvents;

const handler = async (client: Client<true>) => {
    console.log('🥳Logged in as', client.user?.tag);
    client.user?.setActivity('時報', {
        type: ActivityType.Watching,
    });
    await registerCommands();

    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID ?? '')
    if (!channel?.isTextBased()) return;

    channel.messages.fetch({
        limit: 100,
    } as FetchMessagesOptions).then(messages => {
        messages.forEach(message => {
            if (message.author.id === client.user?.id) {
                message.delete();
            }
        });
    }).catch(console.error);

    const now = new Date();
    // 0秒もしくは30秒になるまで待機
    const delay = 30 - now.getSeconds() % 30;
    console.log(`⏳${delay}秒待機します`);
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));

    let sent_message_id = '';

    // 30秒ごとに時報を表示
    setInterval(async() => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        if (
            (hour === 0 || hour === 6 || hour === 12 || hour === 18)
            && minute === 0
            && second === 0
        ) {
            const message = `🕒時報BOTが${hour}時${minute}分${second}秒をお知らせします。`;
            console.log(message);

            if (sent_message_id) {
                const sent_message = await channel.messages.fetch(sent_message_id);
                sent_message.delete();
            }

            if (hour === 0) {
                const sent_message = await channel.send({
                    content: message,
                    files: [
                        path.join(__dirname, '../', 'nico.mp4'),
                    ],
                });
                sent_message_id = sent_message.id;
            } else {
                const sent_message = await channel.send(message);
                sent_message_id = sent_message.id;
            }
        }
    }, 1000);
}

export {
    name,
    handler,
}
