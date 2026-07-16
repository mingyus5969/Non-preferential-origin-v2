const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const fixCode = fs.readFileSync('funcs.txt', 'utf8');
const target = 'function openLawModal(lawId) {';
html = html.replace(target, fixCode + '\n' + target);
fs.writeFileSync('index.html', html, 'utf8');
console.log("Appended missing functions!");
