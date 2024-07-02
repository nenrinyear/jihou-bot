import fs from 'fs';
import path from 'path';

// eventsディレクトリ内のファイルを読み込む
const files = fs.readdirSync(path.join(__dirname, '/events'));

const events = files.map((file) => {
    const event = require(`./events/${file}`);
    return event;
});

export default events;
