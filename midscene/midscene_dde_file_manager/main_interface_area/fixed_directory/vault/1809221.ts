// @ts-nocheck

/**
 * 用例 PMSID: 1809221
 * 用例标题: 创建/删除保险箱-事件上报
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

const logDir = '/var/lib/deepin/event-log';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 有界轮询：反复执行 probe，返回 true 视为状态达成；用于替代固定 sleep（system.exec 零模型成本）
async function waitUntil(probe, timeoutMs, intervalMs = 500) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (await probe()) return true;
        await sleep(intervalMs);
    }
    return false;
}

async function getLatestLogFile(system) {
    const result = await system.exec(`ls -t ${logDir}/event_*.log 2>/dev/null | head -1`);
    return String((result && result.stdout) || '').trim();
}

async function getLogFileSize(system, logFile) {
    const result = await system.exec(`stat -c %s '${logFile}' 2>/dev/null || echo 0`);
    return parseInt(String((result && result.stdout) || '0').trim(), 10) || 0;
}

async function recordLogStart(system) {
    const logFile = await getLatestLogFile(system);
    if (!logFile) {
        throw new Error(`未找到埋点日志文件，请确认 ${logDir} 目录存在且有 event_*.log`);
    }
    const offset = await getLogFileSize(system, logFile);
    console.log(`埋点日志: ${logFile}，操作前大小: ${offset}`);
    return { logFile, offset };
}

async function collectNewLogs(system, mark) {
    const latest = await getLatestLogFile(system);
    if (latest && latest !== mark.logFile) {
        const result = await system.exec(`cat '${latest}'`);
        return String((result && result.stdout) || '').trim();
    }
    const result = await system.exec(`tail -c +${mark.offset + 1} '${mark.logFile}'`);
    return String((result && result.stdout) || '').trim();
}

async function assertVaultEvent(system, mark, scene) {
    // 原固定 sleep(3000)：改为有界轮询埋点日志增长且关键字段已落盘（客观判据，通常 <1s 返回，上限 10s）
    let newLogs = '';
    await waitUntil(async () => {
        newLogs = await collectNewLogs(system, mark);
        return !!newLogs && newLogs.includes('app_version') && newLogs.includes('sysTime')
            && /vault|保险箱|Vault|\\u4fdd\\u9669\\u7bb1/i.test(newLogs);
    }, 10000);
    console.log(`${scene}新增埋点日志:\n${newLogs}`);
    if (!newLogs) {
        throw new Error(`断言失败：${scene}后未产生新的埋点日志`);
    }
    const hasAppVersion = newLogs.includes('app_version');
    const hasSysTime = newLogs.includes('sysTime');
    const hasVaultEvent = /vault|保险箱|Vault|\\u4fdd\\u9669\\u7bb1/i.test(newLogs);
    if (!hasAppVersion || !hasSysTime || !hasVaultEvent) {
        throw new Error(`断言失败：${scene}埋点日志缺少必要内容 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, 保险箱事件:${hasVaultEvent}`);
    }
    console.log(`✅ ${scene}事件上报校验通过：包含版本号、触发时间及保险箱事件`);
}

describe('1809221-创建/删除保险箱-事件上报', () => {

    // 激活桌面窗口（uos.showDesktop 在远程环境会唤出启动器应用列表，改用 wmctrl 激活）
    async function activateDesktop(device, system) {
        await device.pressKey('Esc');
        await sleep(500);
        const res = await system.exec('wmctrl -l', 10000);
        const lines = String(res?.stdout || '').split('\n').filter((item) => item.trim());
        console.log('诊断点: wmctrl -l =>', lines.slice(0, 12).join(' | '));
        const line = lines.find((item) => /桌面|Desktop/i.test(item));
        const id = line ? line.trim().split(/\s+/)[0] : '';
        if (id) {
            await system.exec(`wmctrl -i -a ${id}`, 5000);
        } else {
            await system.exec('wmctrl -k on', 5000);
        }
        await sleep(1000);
    }

    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        const { clearEnvironment, rmVault, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await rmVault(system);
        await activateDesktop(device, system);
    });

    beforeEach(async ({ device }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await device.pressKey('Esc');
        await sleep(500);
    });

    test('1809221-创建/删除保险箱-事件上报', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault, createNoPasswordVault, UiRmVault, UiRmNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        console.log('===== 步骤1: 使用密钥加密创建保险箱 =====');
        const createPwdMark = await recordLogStart(system);
        await createPasswordVault(uos, env, agent, device, system);
        await assertVaultEvent(system, createPwdMark, '密钥加密创建保险箱');
        console.log('✅ 预期1验证通过');

        console.log('===== 步骤2: 删除密钥加密保险箱 =====');
        const rmPwdMark = await recordLogStart(system);
        await UiRmVault(device, agent, uos, env, system);
        await assertVaultEvent(system, rmPwdMark, '删除密钥加密保险箱');
        console.log('✅ 预期2验证通过');
        // 原固定 sleep(3000)：改为有界轮询保险箱配置目录已被清理（上限与原等待一致）
        await waitUntil(async () => {
            const res = await system.exec('test -d ~/.config/Vault && echo EXISTS || echo REMOVED', 10000);
            return String((res && res.stdout) || '').indexOf('REMOVED') >= 0;
        }, 3000);

        console.log('===== 步骤3: 使用透明加密创建保险箱 =====');
        const createNoPwdMark = await recordLogStart(system);
        await createNoPasswordVault(uos, env, agent, device, system);
        await assertVaultEvent(system, createNoPwdMark, '透明加密创建保险箱');
        console.log('✅ 预期3验证通过');

        console.log('===== 步骤4: 删除透明加密保险箱 =====');
        const rmNoPwdMark = await recordLogStart(system);
        await UiRmNoPasswordVault(device, agent, uos, env, system);
        await assertVaultEvent(system, rmNoPwdMark, '删除透明加密保险箱');
        console.log('✅ 预期4验证通过');

        console.log('✅ 测试用例执行完成');
    }, { timeout: 1800000, tags: ['1809221', 'level3', 'main_interface_area', 'fixed_directory', 'vault', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        try {
            await device.pressKey('Esc');
        } catch (err) {
            console.log('按Esc失败，忽略');
        }
        const { rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await rmVault(system);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
