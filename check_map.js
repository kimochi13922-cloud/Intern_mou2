const fs = require('fs');

const indexPage = fs.readFileSync('./src/pages/IndexPage.jsx', 'utf8');

// Extract NATION_LIST from addmoupage
const addmoupage = fs.readFileSync('./src/pages/addmoupage.jsx', 'utf8');
const nationMatch = addmoupage.match(/export const NATION_LIST = (\[.*?\]);/s);
if (!nationMatch) {
  console.log("Could not find NATION_LIST");
  process.exit(1);
}
const nationList = eval(nationMatch[1]);

// Extract map from IndexPage
const mapMatch = indexPage.match(/const map = ({[\s\S]*?});/);
if (!mapMatch) {
  console.log("Could not find map object");
  process.exit(1);
}

// Evaluate map carefully
let mapText = mapMatch[1];
let mapObj;
try {
  mapObj = eval('(' + mapText + ')');
} catch(e) {
  console.log("Error evaluating map", e);
  process.exit(1);
}

const missing = [];
for (const nation of nationList) {
  const lower = nation.trim().toLowerCase();
  if (!mapObj[lower]) {
    missing.push(lower);
  }
}

if (missing.length > 0) {
  console.log("MISSING COUNTRIES IN MAP:");
  console.log(missing);
} else {
  console.log("All countries are mapped perfectly!");
}
