import fs from "fs";
 
const htmlPath = "./dist/index.html"; // 打包后的html文件路径
const htmlText = fs.readFileSync(htmlPath, 'utf8');
const result = htmlText.replace(/\/log-lottery/g, '.')
console.log(result)
fs.writeFileSync(htmlPath, result, 'utf8');
 
console.log("处理完成");