const fs = require('fs');

let allCases = [];
for (let i = 1; i <= 5; i++) {
  let file = `cases_${i}.json`;
  if (fs.existsSync(file)) {
    allCases.push(...JSON.parse(fs.readFileSync(file, 'utf-8')));
  }
}

function parseCase(c) {
  let content = c.content || "";
  let title = c.title || "";
  
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
  
  if (!query) query = title + "에 대한 질의";
  if (!reply) reply = content.replace(/■.*?(\n|$)/g, '').trim();
  
  let category = "II";
  let categoryLabel = "원산지 판정·규정";
  if (
    title.includes("표시방법") || title.includes("표시 방법") || title.includes("표시") || 
    content.includes("최소포장") || title.includes("오인표시") || title.includes("라벨") || content.includes("한글표시사항")
  ) {
    category = "I";
    categoryLabel = "원산지표시 방법";
  }
  
  let laws = lawsStr ? lawsStr.split(/,\s*/).map(s => s.replace(/^ㅇ\s*/, '').trim()).filter(Boolean) : [];
  
  let words = indexStr.split(/[\s,]+/).filter(w => w.length > 0 && w !== '없음' && w !== '무' && w !== 'no');
  let tags = [...new Set(words)];
  
  let extractTerms = ["식료품", "감속기", "감열지", "강황", "의류", "커피", "가죽", "케이스", "돼지고기", "수산물", "오일", "주스"];
  extractTerms.forEach(t => {
      if ((title.includes(t) || content.includes(t)) && !tags.includes(t)) tags.push(t);
  });
  
  if (tags.length === 0) tags = [title.split(" ")[0] || "판정기준"];
  
  let org = "관세청";
  if (content.includes("산업통상자원부") || content.includes("산업통상부") || content.includes("산업부")) {
      org = "산업통상자원부";
  }
  
  let yearMatch = content.match(/20[1-2][0-9]\./);
  let year = yearMatch ? yearMatch[0].replace('.', '') : "2021";
  
  let rId = `C-${c.id.toString().padStart(3, '0')}`;
  
  return {
    id: rId,
    category,
    categoryLabel,
    title,
    org: org,
    sourceOrg: org,
    year: year,
    detail: org,
    laws,
    query,
    reply,
    keywords: tags,
    tags
  };
}

let mappedCases = allCases.map(parseCase);

let exportStr = "const ALL_CASES = " + JSON.stringify(mappedCases, null, 2) + ";";
fs.writeFileSync('output_cases_v2.cjs', exportStr);
console.log(`Generated output_cases_v2.cjs with ${mappedCases.length} cases.`);
