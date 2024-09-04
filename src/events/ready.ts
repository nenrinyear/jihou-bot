import { ActivityType, Client, ClientEvents } from "discord.js";
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

    const now = new Date();
    // 0秒もしくは30秒になるまで待機
    const delay = 30 - now.getSeconds() % 30;
    console.log(`⏳${delay}秒待機します`);
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));

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
            
            if (hour === 0) {
                await channel.send({
                    content: message,
                    files: [
                        path.join(__dirname, '../', 'nico.mp4'),
                    ],
                });
            } else {
                await channel.send(message);
            }
        }
    }, 1000);
}

export {
    name,
    handler,
}
