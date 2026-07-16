const fs = require('fs');

const allCases = [];
for (let i = 1; i <= 5; i++) {
  const file = `cases_${i}.json`;
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    allCases.push(...data);
  }
}

function parseCase(c) {
  let content = c.content;
  let title = c.title;
  
  // Extract sections
  let query = "";
  let reply = "";
  let lawsStr = "";
  let indexStr = "";
  
  let qMatch = content.match(/■ 질\s*의\n([\s\S]*?)(?=■ 회\s*신|■ 관련 규정|♧ 색인 참조|$)/);
  if (qMatch) query = qMatch[1].trim();
  
  let rMatch = content.match(/■ 회\s*신\n([\s\S]*?)(?=■ 관련 규정|♧ 색인 참조|$)/);
  if (rMatch) reply = rMatch[1].trim();
  
  let lMatch = content.match(/■ 관련 규정\n([\s\S]*?)(?=♧ 색인 참조|$)/);
  if (lMatch) lawsStr = lMatch[1].trim();
  
  let iMatch = content.match(/♧ 색인 참조\s*:\s*(.*)/);
  if (iMatch) indexStr = iMatch[1].trim();
  
  if(!query) query = title + "에 대한 질의";
  
  let category = "II";
  let categoryLabel = "원산지 판정·규정";
  if (title.indexOf("표시방법") !== -1 || title.indexOf("표시 방법") !== -1 || title.indexOf("표시") !== -1 || content.indexOf("최소포장") !== -1) {
    category = "I";
    categoryLabel = "원산지표시 방법";
  }
  
  let laws = lawsStr ? lawsStr.split(/,\s*/).map(s => s.replace(/^ㅇ\s*/, '').trim()).filter(Boolean) : [];
  
  let words = indexStr.split(/[\s,]+/).filter(w => w.length > 0 && w !== '없음' && w !== '무' && w !== 'no');
  let tags = [...new Set(words)];
  if(tags.length === 0) tags = [title.split(" ")[0]];
  
  let rId = `C-${c.id.toString().padStart(3, '0')}`;
  
  return {
    id: rId,
    category,
    categoryLabel,
    title,
    org: "관세청",
    sourceOrg: "관세청",
    year: "2020",
    detail: "관세청",
    laws,
    query,
    reply,
    keywords: tags,
    tags
  };
}

const mappedCases = allCases.map(parseCase);

const exportStr = "const ALL_CASES = " + JSON.stringify(mappedCases, null, 2) + ";\n";

fs.writeFileSync('output_cases.js', exportStr);
console.log(`Successfully mapped ${mappedCases.length} cases.`);
