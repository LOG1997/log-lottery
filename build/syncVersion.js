import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 package.json 版本号
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = packageJson.version;

// 读取并更新 tauri.conf.json
const tauriConfPath = path.join(__dirname, '..', 'src-tauri', 'tauri.conf.json');
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));

// 更新版本号
tauriConf.version = version;

// 写回 tauri.conf.json
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

console.log(`Tauri 配置版本号已同步至: ${version}`);