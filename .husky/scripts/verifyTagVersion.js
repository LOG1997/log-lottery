import fs from 'fs';

try {
    // 读取 package.json 中的版本号
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const packageVersion = packageJson.version;

    // 获取命令行参数中的 tag 名称
    const tag = process.argv[2];

    if (!tag) {
        console.log('⚠️  未提供 tag 参数，跳过版本校验');
        process.exit(0);
    }

    // 检查 tag 是否与 package.json 版本匹配
    const validTags = [`v${packageVersion}`, packageVersion];

    if (!validTags.includes(tag)) {
        console.log('🏷️  Git tag 版本校验不通过');
        console.error(`当前 package.json 版本为: ${packageVersion}`);
        console.error(`提供的 tag 为: ${tag}`);
        process.exit(1);
    } else {
        console.log('✅ Git tag 版本校验通过');
    }
} catch (error) {
    console.error('❌ 校验过程中发生错误:', error.message);
    process.exit(1);
}