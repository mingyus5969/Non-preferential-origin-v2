const fs = require('fs');
const crypto = require('crypto');
let html = fs.readFileSync('index.html', 'utf8');

function getHash(text) {
    return 'sha256-' + crypto.createHash('sha256').update(text).digest('base64');
}

let scriptMatch1 = html.match(/<script>([\s\S]*?)<\/script>/);
let scriptMatch2 = html.match(/<script>([\s\S]*?)<\/script>/g)[1]; // second script
let styleMatch1 = html.match(/<style>([\s\S]*?)<\/style>/);
let styleMatch2 = html.match(/<style>([\s\S]*?)<\/style>/g)[1]; // second style

console.log("Script 1:", getHash(scriptMatch1[1]));
console.log("Script 2:", getHash(scriptMatch2.replace(/<script>/, '').replace(/<\/script>/, '')));
console.log("Style 1:", getHash(styleMatch1[1]));
console.log("Style 2:", getHash(styleMatch2.replace(/<style>/, '').replace(/<\/style>/, '')));
