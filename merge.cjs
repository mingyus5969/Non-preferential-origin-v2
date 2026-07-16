const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const match = html.match(/const ORIGIN_CASES = (\[[\s\S]*?\]);/);
if (match) {
    const existing = JSON.parse(match[1]);
    const newData = require('./cases_new.js');
    
    // Check if new data is already included? ID 132 maybe.
    const ids = new Set(existing.map(o => o.id));
    for (let d of newData) {
        if (!ids.has(d.id)) {
            existing.push(d);
        }
    }
    
    const newStr = 'const ORIGIN_CASES = ' + JSON.stringify(existing, null, 2) + ';';
    
    html = html.replace(match[0], newStr);
    
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Successfully merged items. Total:", existing.length);
} else {
    console.log("Could not find ORIGIN_CASES in index.html");
}
