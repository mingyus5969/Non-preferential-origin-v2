const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove all CSP meta tags
html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');

// 2. Add SRI to CDN links
html = html.replace(/<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6.4.0\/css\/all.min.css">/, '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0" crossorigin="anonymous">');

html = html.replace(/<link rel="preload" href="https:\/\/cdn.jsdelivr.net\/gh\/orioncactus\/pretendard\/dist\/web\/static\/pretendard.css" as="style">/, '<link rel="preload" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" as="style" integrity="sha384-SN6A48CJQjx946+DRb8wsoifC4a8ur9ZS6R+HCTgnBHOKCa6GLXAR3Qn8d1jztxg" crossorigin="anonymous">');

html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn.jsdelivr.net\/gh\/orioncactus\/pretendard\/dist\/web\/static\/pretendard.css">/, '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" integrity="sha384-SN6A48CJQjx946+DRb8wsoifC4a8ur9ZS6R+HCTgnBHOKCa6GLXAR3Qn8d1jztxg" crossorigin="anonymous">');

html = html.replace(/<script src="https:\/\/cdn.tailwindcss.com"><\/script>/, '<script src="https://cdn.tailwindcss.com" integrity="sha384-OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb" crossorigin="anonymous"></script>');

// 3. Move modal out of head to body if it is inside head
if (html.indexOf('<!-- Case Content Modal -->') < html.indexOf('<body')) {
    let modalStart = html.indexOf('<!-- Case Content Modal -->');
    let modalEnd = html.indexOf('<script>', modalStart);
    let modals = html.substring(modalStart, modalEnd);
    html = html.substring(0, modalStart) + html.substring(modalEnd);
    
    let bodyStart = html.indexOf('<body');
    let bodyEnd = html.indexOf('>', bodyStart) + 1;
    html = html.substring(0, bodyEnd) + '\n' + modals + html.substring(bodyEnd);
}

// 4. Refactor inline event handlers
let scriptAdditions = "\n// --- Auto-generated Event Listeners ---\n";
let counter = 0;
let events = ['onclick', 'oninput', 'onkeydown'];
for (let ev of events) {
    let regex = new RegExp(`${ev}="([^"]+)"`, 'g');
    html = html.replace(regex, (match, code) => {
        counter++;
        let actionId = `action-${counter}`;
        scriptAdditions += `document.querySelectorAll('[data-action="${actionId}"]').forEach(el => el.addEventListener('${ev.replace('on', '')}', function(event) { ${code} }));\n`;
        return `data-action="${actionId}"`;
    });
}

// 5. Append scriptAdditions to the main script
html = html.replace('</script>\n</body>', scriptAdditions + '</script>\n</body>');

fs.writeFileSync('index.html', html);
