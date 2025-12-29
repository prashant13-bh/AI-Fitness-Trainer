const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('node_modules/@mediapipe/pose/package.json', 'utf8'));
console.log(JSON.stringify(pkg, null, 2));
