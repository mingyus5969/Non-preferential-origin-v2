const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf-8');
const mappedCasesStr = fs.readFileSync('output_cases.js', 'utf-8');

// The exported string is `const ALL_CASES = [\n...];\n`
// Let's replace the block in index.html starting with "const ALL_CASES ="
// and ending right before "const lawsData ="

const startMarker = "const ALL_CASES = [";
const endMarker = "const lawsData = [";

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

// Ensure mappedCasesStr matches the variable name format
let injection = mappedCasesStr.trim();
// Strip trailing semicolon if needed, though it's fine.
// The endMarker starts right at "const lawsData ="
// So we insert right before it with a couple newlines.

const newHtml = indexHtml.substring(0, startIndex) + injection + "\n\n" + indexHtml.substring(endIndex);

fs.writeFileSync('index.html', newHtml, 'utf-8');
console.log('Successfully injected ALL_CASES into index.html');
