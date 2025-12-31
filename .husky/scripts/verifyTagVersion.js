import fs from 'fs';
import { execSync } from 'child_process';

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

    // 获取 tag 指向的提交哈希
    const tagCommit = execSync(`git rev-list -1 ${tag}`, { encoding: 'utf-8' }).trim();

    // 获取当前分支名称
    let currentBranch;
    try {
        currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (e) {
        console.error('无法获取当前分支名称');
        process.exit(1);
    }
    console.log(`当前分支为: ${currentBranch}`);
    // 检查当前分支是否为 release 分支
    if (currentBranch.startsWith('release')) {
        // 如果当前在 release 分支上，检查当前分支的 HEAD 提交是否与 tag 指向的提交一致
        const currentBranchCommit = execSync(`git rev-parse ${currentBranch}`, { encoding: 'utf-8' }).trim();

        if (tagCommit !== currentBranchCommit) {
            console.log('🏷️  Git tag 指向的提交与当前 release 分支的最新提交不一致');
            console.error(`当前 release 分支 "${currentBranch}" 的最新提交为: ${currentBranchCommit}`);
            console.error(`Tag "${tag}" 指向的提交为: ${tagCommit}`);
            process.exit(1);
        } else {
            console.log('✅ Git tag 指向的提交与当前 release 分支的最新提交一致');
        }
    } else {
        // 如果当前不在 release 分支上，查找所有 release 分支并检查是否有分支的 HEAD 与 tag 指向的提交一致
        console.log(`🔍 当前在 "${currentBranch}" 分支，检查 tag 指向的提交是否与任何 release 分支的最新提交一致`);

        // 获取所有本地分支
        const localBranchesOutput = execSync('git branch --format="%(refname:short)"', { encoding: 'utf-8' });
        const localBranches = localBranchesOutput.split('\n').map(b => b.trim()).filter(b => b);

        // 过滤出 release 分支
        const releaseBranches = localBranches.filter(branch => branch.startsWith('release/'));

        if (releaseBranches.length === 0) {
            console.log('⚠️  未找到 release 分支');
            process.exit(1);
        }

        let foundMatchingBranch = false;
        let matchingBranchName = '';

        for (const branch of releaseBranches) {
            try {
                // 获取 release 分支的最新提交
                const releaseBranchCommit = execSync(`git rev-parse ${branch}`, { encoding: 'utf-8' }).trim();

                // 检查是否与 tag 指向的提交一致
                if (tagCommit === releaseBranchCommit) {
                    foundMatchingBranch = true;
                    matchingBranchName = branch;
                    break;
                }
            } catch (e) {
                // 如果无法获取分支信息，继续尝试下一个分支
                continue;
            }
        }

        if (!foundMatchingBranch) {
            console.log('🏷️  Git tag 指向的提交与任何 release 分支的最新提交都不一致');
            console.error(`提供的 tag 为: ${tag}`);
            console.error(`tag 指向的提交为: ${tagCommit}`);
            console.log(`检查了以下 release 分支:`, releaseBranches);
            console.log('可能的原因：');
            console.log('1. release 分支不是最新的');
            console.log('2. tag 指向的提交不在 release 分支上');
            process.exit(1);
        } else {
            console.log(`✅ Git tag 指向的提交与 release 分支 "${matchingBranchName}" 的最新提交一致`);
        }
    }
} catch (error) {
    console.error('❌ 校验过程中发生错误:', error.message);
    process.exit(1);
}