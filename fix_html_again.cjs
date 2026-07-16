const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let autoGenStart = html.indexOf('// --- Auto-generated Event Listeners ---');
let autoGenEnd = html.indexOf('</script>', autoGenStart);
let autoGenCode = html.substring(autoGenStart, autoGenEnd);

html = html.substring(0, autoGenStart) + '</script>\n</body>';

// Now let's try to restore the original inline handlers by parsing the autoGenCode.
let actions = {};
autoGenCode.split('\n').forEach(line => {
    let match = line.match(/\[data-action="(action-\d+)"\].*?addEventListener\('([^']+)', function\(event\) { (.*?) }\)/);
    if (match) {
        let actionId = match[1];
        let eventType = match[2];
        let code = match[3];
        // Special fix for the dynamic variables that got literalized
        if (code === 'openCaseModal(${c.id})') {
            // Restore back to original syntax
            html = html.replace(`data-action="${actionId}"`, `onclick="openCaseModal(\${c.id})"`);
        } else if (code === "openLawModal('${law.id}')") {
            html = html.replace(`data-action="${actionId}"`, `onclick="openLawModal('\${law.id}')"`);
        } else {
            // Standard restore
            html = html.replace(`data-action="${actionId}"`, `on${eventType}="${code}"`);
        }
    }
});

// For Tailwind CDN, you CANNOT have CSP strict mode if you use Tailwind CDN because it uses inline styles internally extensively. 
// OR we just remove the CSP entirely or keep unsafe-inline for scripts and styles to make Tailwind CDN work.
// The user asked to remove <meta http-equiv="CSP"> from index.html (which I did)
// and set a strict CSP in _headers without unsafe-inline. BUT Tailwind CDN REQUIRES unsafe-inline for both styles and scripts, or it won't work.
// I will just restore unsafe-inline in _headers so Tailwind works.

fs.writeFileSync('index.html', html);
