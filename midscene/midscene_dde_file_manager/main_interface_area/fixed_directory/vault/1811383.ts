// @ts-nocheck
/**
 * 用例 PMSID: 1811383
 * 用例标题: 多窗口操作保险箱
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/10/22
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 有界轮询：反复执行 probe，返回 true 视为状态达成；用于替代固定 sleep（system.exec 零模型成本）
async function waitUntil(probe, timeoutMs, intervalMs = 500) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (await probe()) return true;
        await sleep(intervalMs);
    }
    return false;
}

// 激活指定文管窗口，使 AI 操作作用于该窗口
async function activateWindow(system, winId) {
    await system.exec(`wmctrl -i -a ${winId}`, 5000);
    // 原固定 sleep(2000)：改为有界轮询窗口是否已成为活动窗口
    // （getUserFileManagerWindowIds 返回 0x0820000a 形式，xprop 返回 0x820000a，统一按数值比较）
    const target = parseInt(String(winId), 16);
    await waitUntil(async () => {
        const res = await system.exec('xprop -root _NET_ACTIVE_WINDOW', 5000);
        const matched = String((res && res.stdout) || '').match(/0x[0-9a-fA-F]+/);
        return !!matched && parseInt(matched[0], 16) === target;
    }, 3000, 300);
    await sleep(300);
    console.log(`已激活窗口 ${winId}`);
}

// 通过 mountpoint 判断保险箱是否处于解锁（已挂载）状态
async function isVaultMounted(system, vaultUnlocked) {
    const res = await system.exec(`mountpoint -q ${vaultUnlocked} && echo MOUNTED || echo LOCKED`, 10000);
    const out = (((res && res.stdout) || '') + ((res && res.stderr) || '')).trim();
    console.log(`保险箱挂载状态: ${out}`);
    return out.indexOf('MOUNTED') >= 0;
}

// 右键侧边栏保险箱选择“立即上锁”，并以 mountpoint 回读确认；失败时重试
async function lockVault(agent, device, system, vaultUnlocked) {
    for (let i = 0; i < 3; i++) {
        try {
            // 菜单项定位不需要深度思考，去档减少单次模型耗时
            await agent.aiRightClick('文件管理器左侧栏的保险箱');
            // 原 aiWaitFor('出现右击菜单', { timeout: 8000 })：菜单同步弹出，改为固定短等待，省 1 次模型调用
            await sleep(900);
            await agent.aiTap('立即上锁');
            console.log(`第${i + 1}次点击立即上锁`);
        } catch (e) {
            console.log(`第${i + 1}次上锁操作失败: ${e}`);
            await device.pressKey('Esc');
            await sleep(1000);
            continue;
        }
        // 原固定 sleep(4000)：改为有界轮询挂载状态变为 LOCKED（上限与原等待一致）
        const locked = await waitUntil(async () => !(await isVaultMounted(system, vaultUnlocked)), 4000, 1000);
        if (locked) {
            console.log('保险箱已上锁');
            return true;
        }
        console.log(`第${i + 1}次上锁后仍处于挂载状态，重试`);
        await device.pressKey('Esc');
        await sleep(1000);
    }
    return false;
}

// cryfs 挂载目录对 shell 的读写不稳定（lookup 返回 EACCES），改为在家目录生成文件后通过文件管理器复制进保险箱
async function prepareHomeFile(system, fileName) {
    const src = `${TEST_HOME}/${fileName}`;
    const res = await system.exec(`echo "1811383 vault search content" > "${src}"; test -s "${src}" && echo FILE_OK || echo FILE_BAD`, 10000);
    const out = (((res && res.stdout) || '') + ((res && res.stderr) || '')).trim();
    console.log(`准备家目录测试文件: ${out}`);
    return out.indexOf('FILE_OK') >= 0;
}

// 通过文件管理器把家目录中的测试文件复制到保险箱当前目录，复制完成后删除家目录源文件
async function copyFileIntoVault(agent, device, system, fileName, marker) {
    await agent.aiTap('文件管理器左侧的主目录');
    await sleep(2000);
    await agent.aiTap(`文件管理器中名为 ${fileName} 的文件`);
    await sleep(1000);
    await device.pressKey('Ctrl+C');
    await sleep(1000);
    await agent.aiTap('文件管理器左侧栏的保险箱');
    await sleep(2500);
    await device.pressKey('Ctrl+V');
    await agent.aiWaitFor(`保险箱目录中显示文件 ${marker}`, { timeout: 40000, checkIntervalMs: 3000 });
    await system.exec(`rm -f ${TEST_HOME}/${fileName}`, 10000);
    console.log(`测试文件已复制进保险箱: ${fileName}`);
}

// 右键侧边栏主目录选择“在新窗口中打开”，直到用户文管窗口数达到 target
async function openWindowsUntil(agent, device, system, target) {
    const { getUserFileManagerWindowIds } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    let wins = await getUserFileManagerWindowIds(system);
    console.log(`当前用户文管窗口: ${wins.join(',') || '无'}`);
    for (let i = 0; i < 4 && wins.length < target; i++) {
        const before = wins.length;
        try {
            // 菜单项定位不需要深度思考，去档减少单次模型耗时
            await agent.aiRightClick('文件管理器左侧的主目录');
            // 原 aiWaitFor('右键菜单已展开', { timeout: 8000 })：菜单同步弹出，改为固定短等待，省 1 次模型调用
            await sleep(900);
            await agent.aiTap('右键菜单中的在新窗口中打开');
        } catch (e) {
            console.log(`第${i + 1}次打开新窗口失败: ${e}`);
            await device.pressKey('Esc');
            await sleep(1000);
        }
        // 原固定 sleep(3000)：改为有界轮询文管窗口数增加（上限 4000）
        await waitUntil(async () => {
            const cur = await getUserFileManagerWindowIds(system);
            return cur.length > before;
        }, 4000, 800);
        wins = await getUserFileManagerWindowIds(system);
        console.log(`第${i + 1}次尝试后用户文管窗口数: ${wins.length}`);
    }
    return wins;
}

describe('1811383-多窗口操作保险箱', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await rmVault(system);
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const USER = `'${escShell(TEST_USER)}'`;
        await device.pressKey('Esc');
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`);
        await system.exec(`rm -f /home/${USER}/1811383.txt`);
    });

    test('1811383-多窗口操作保险箱', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault, vaultPassword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const vaultUnlocked = `${TEST_HOME}/.config/Vault/vault_unlocked`;
        const searchFileName = '1811383.txt';
        const searchKeyword = '1811383';

        // 前置条件: 创建已解锁的密码保险箱
        console.log('前置条件: 创建已解锁的密码保险箱');
        await createPasswordVault(uos, env, agent, device, system);
        // 原固定 sleep(3000)：改为有界轮询保险箱挂载完成（上限与原等待一致）
        await waitUntil(async () => {
            const res = await system.exec(`mountpoint -q ${vaultUnlocked} && echo MOUNTED || echo LOCKED`, 10000);
            return String((res && res.stdout) || '').indexOf('MOUNTED') >= 0;
        }, 3000);

        // 前置条件: 在保险箱中准备可搜索的文件
        console.log('前置条件: 在保险箱中准备可搜索的文件');
        const fileReady = await prepareHomeFile(system, searchFileName);
        if (!fileReady) {
            throw new Error(`保险箱内测试文件创建失败: ${searchFileName}`);
        }
        await copyFileIntoVault(agent, device, system, searchFileName, searchKeyword);

        // 步骤1: 打开3个窗口操作保险箱
        console.log('步骤1: 打开3个文件管理器窗口');
        const wins = await openWindowsUntil(agent, device, system, 3);
        if (wins.length < 3) {
            throw new Error(`文件管理器窗口数不足3个，当前${wins.length}个`);
        }
        const winA = wins[0];
        const winB = wins[1];
        const winC = wins[2];
        console.log(`窗口A=${winA} 窗口B=${winB} 窗口C=${winC}`);

        // 预期1: 3个窗口均可正常进入并显示保险箱内容
        for (let i = 0; i < 3; i++) {
            console.log(`步骤1: 窗口${i + 1}进入保险箱`);
            await activateWindow(system, wins[i]);
            await agent.aiTap('文件管理器左侧栏的保险箱');
            await agent.aiWaitFor(`窗口显示保险箱中的文件 1811383`, { timeout: 40000, checkIntervalMs: 3000 });
            console.log(`窗口${i + 1}操作保险箱正常`);
        }

        // 步骤1: 窗口C给保险箱上锁
        console.log('步骤1: 窗口C给保险箱手动上锁');
        await activateWindow(system, winC);
        const lockedInC = await lockVault(agent, device, system, vaultUnlocked);
        if (!lockedInC) {
            throw new Error('窗口C执行立即上锁失败');
        }

        // 步骤1: 窗口A点击保险箱触发解锁，输入密码后正常进入保险箱
        console.log('步骤1: 窗口A解锁保险箱');
        await activateWindow(system, winA);
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await agent.aiWaitFor('弹出解锁保险箱对话框', { timeout: 30000, checkIntervalMs: 3000 });
        await agent.aiTap('解锁保险箱对话框中的密码字符');
        await device.typeText(vaultPassword, false);
        await agent.aiTap('解锁保险箱对话框中的解锁按钮');
        await agent.aiWaitFor(`跳转到保险箱目录并显示文件 1811383`, { timeout: 90000, checkIntervalMs: 3000 });

        // 预期1: 解锁后窗口B进入保险箱同样正常
        console.log('步骤1: 窗口B确认解锁后可正常访问保险箱');
        await activateWindow(system, winB);
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await agent.aiWaitFor(`窗口显示保险箱中的文件 ${searchKeyword}`, { timeout: 40000, checkIntervalMs: 3000 });
        console.log('预期1: 保险箱不同窗口表现均正常');

        // 步骤2: 窗口A搜索保险箱内容，进入有内容的搜索结果页
        console.log('步骤2: 窗口A搜索保险箱内容');
        await activateWindow(system, winA);
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await sleep(2000);
        await device.pressKey('Ctrl+F');
        await sleep(1500);
        await device.typeText(searchKeyword, true);
        await agent.aiWaitFor(`搜索结果中显示文件 ${searchKeyword}`, { timeout: 60000, checkIntervalMs: 3000 });
        console.log('步骤2: 窗口A已进入有内容的搜索结果页');

        // 步骤2: 窗口B给保险箱手动上锁
        console.log('步骤2: 窗口B给保险箱手动上锁');
        await activateWindow(system, winB);
        const lockedInB = await lockVault(agent, device, system, vaultUnlocked);
        if (!lockedInB) {
            throw new Error('窗口B执行立即上锁失败');
        }

        // 预期2: 上锁成功，窗口A搜索结果页显示无搜索结果
        console.log('预期2: 切回窗口A确认搜索结果页无搜索结果');
        await activateWindow(system, winA);
        await sleep(5000);
        try {
            // 实测（logs/run1025b/1811383.log 18:31:50→18:32:21）30s 内不会自动刷新，空等 30s 后才靠 F5 成功，
            // 故把该等待收敛到 8s，F5 兜底保留
            await agent.aiWaitFor(`当前窗口搜索结果页中没有显示文件 ${searchKeyword}`, { timeout: 8000, checkIntervalMs: 3000 });
        } catch (e) {
            console.log(`保险箱上锁后搜索结果页未自动刷新，刷新窗口后重试: ${e}`);
            await device.pressKey('F5');
            await sleep(5000);
            await agent.aiWaitFor(`当前窗口搜索结果页中没有显示文件 ${searchKeyword}`, { timeout: 40000, checkIntervalMs: 5000 });
        }
        await agent.aiAssert(`窗口A搜索结果页显示无搜索结果，没有文件 ${searchKeyword}`);
        const mountedAfterLock = await isVaultMounted(system, vaultUnlocked);
        if (mountedAfterLock) {
            throw new Error('窗口B上锁后保险箱仍处于挂载状态');
        }
        console.log('预期2: 上锁成功，窗口A搜索结果页显示无搜索结果');

    }, { timeout: 1200000, tags: ['1811383', 'level3', 'vault', 'DITT', 'xuqi', 'multi-window'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, agent, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { escShell, rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const USER = `'${escShell(TEST_USER)}'`;
        await device.pressKey('Esc');
        await rmVault(system);
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await system.exec('killall deepin-editor || true');
        await system.exec('killall dde-file-dialog || true');
        await uos.showDesktop();
    });
});
