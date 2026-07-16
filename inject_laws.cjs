const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const lawsJS = fs.readFileSync('mock_laws.js', 'utf8');

const target = 'const CHART_DATA = {';
html = html.replace(target, lawsJS + '\n\n' + target);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Mock lawsData injected.");
