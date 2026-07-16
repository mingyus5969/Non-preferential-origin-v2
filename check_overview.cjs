const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<section id="overview"');
if (start !== -1) {
    console.log(html.substring(start, start + 3000));
}
