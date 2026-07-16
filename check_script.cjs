const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scripts) {
    scripts.forEach((s, idx) => {
        const content = s.replace(/<\/?script>/g, '');
        fs.writeFileSync('script_' + idx + '.js', content, 'utf8');
        try {
            require('vm').Script(content);
            console.log('Script ' + idx + ' OK');
        } catch (e) {
            console.error('Script ' + idx + ' ERROR:', e);
        }
    });
}
