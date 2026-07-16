const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/const ORIGIN_CASES = (\[[\s\S]*?\]);/);
if (match) {
    const list = JSON.parse(match[1]);
    console.log("Total origin cases:", list.length);
    console.log("Last case ID:", list[list.length - 1].id);
}
