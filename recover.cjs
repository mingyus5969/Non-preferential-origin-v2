const fs = require('fs');

const path = '/.gemini/antigravity/brain/a04dd786-5024-409c-ab86-f5c4e26f14a5/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(path)) {
    console.error("Transcript file not found.");
    process.exit(1);
}

const lines = fs.readFileSync(path, 'utf8').split('\n');
let lawsDataBlock = '';
let inBlock = false;

for (const line of lines) {
    if (line.includes('const lawsData = [')) {
        inBlock = true;
        lawsDataBlock = [];
    }
    if (inBlock) {
        lawsDataBlock.push(line);
        if (line.includes('];') && line.includes('id:') === false && line.includes('title:') === false && lawsDataBlock.length > 5) {
            inBlock = false;
        }
    }
}

if (lawsDataBlock.length > 0) {
    fs.writeFileSync('recovered_laws.txt', lawsDataBlock.join('\n'));
    console.log("Recovered lawsData array of length", lawsDataBlock.length);
} else {
    console.log("Could not find lawsData in transcript.");
}
