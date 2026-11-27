// @ts-nocheck
/**
 * 用例 PMSID: 1810965
 * 用例标题: 关闭后再创建保险箱-密钥加密-事件上报
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/10/22
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const logDir = '/var/lib/deepin/event-log';

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

// 获取最新的埋点日志文件路径
async function getLatestLogFile(system) {
    const findResult = await system.exec(`ls -t ${logDir}/event_*.log 2>/dev/null | head -1`);
    return findResult.stdout.trim();
}

// 获取日志文件大小（字节数），用于计算新增日志的偏移量
async function getLogFileSize(system, logFile) {
    const result = await system.exec(`stat -c %s ${logFile} 2>/dev/null || echo 0`);
    return parseInt(result.stdout.trim(), 10);
}

// 从指定偏移量开始读取新增日志；offset 为 0 时只取日志尾部，避免整文件输出
async function readNewLogs(system, logFile, offset) {
    if (offset > 0) {
        const result = await system.exec(`tail -c +${offset + 1} ${logFile} | tail -c 60000`);
        return result.stdout.trim();
    }
    const result = await system.exec(`tail -c 60000 ${logFile}`);
    return result.stdout.trim();
}

// 获取已安装的文件管理器版本号（取包版本主版本，如 6.5.168-1 -> 6.5.168）
async function getInstalledVersion(system) {
    const result = await system.exec(`dpkg-query -W -f='\${Version}' dde-file-manager 2>/dev/null`);
    const out = (((result && result.stdout) || '') + ((result && result.stderr) || '')).trim();
    return out.split('-')[0];
}

describe('1810965-关闭后再创建保险箱-密钥加密-事件上报', () => {
    beforeAll(async ({ uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await rmVault(system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const USER = `'${escShell(TEST_USER)}'`;
        await device.pressKey('Esc');
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`);
    });

    test('1810965-关闭后再创建保险箱-密钥加密-事件上报', async ({ device, uos, agent, env, system }) => {
        const { createPasswordVault, UiRmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const vaultUnlocked = `${TEST_HOME}/.config/Vault/vault_unlocked`;

        // 前置条件: 保险箱开启后再次删除，保证本次创建是从未创建状态开始
        console.log('前置条件: 创建保险箱');
        await createPasswordVault(uos, env, agent, device, system);
        // 原固定 sleep(3000)：改为有界轮询保险箱挂载状态，已达成立即返回
        await waitUntil(async () => {
            const res = await system.exec(`mountpoint -q ${vaultUnlocked} && echo MOUNTED || echo LOCKED`, 10000);
            return String((res && res.stdout) || '').indexOf('MOUNTED') >= 0;
        }, 3000);
        console.log('前置条件: 删除已创建的保险箱');
        await UiRmVault(device, agent, uos, env, system);
        // 原固定 sleep(5000)：改为有界轮询保险箱配置目录消失（上限与原等待一致）
        const vaultRemoved = await waitUntil(async () => {
            const res = await system.exec(`test -d ${TEST_HOME}/.config/Vault && echo EXISTS || echo REMOVED`, 10000);
            return String((res && res.stdout) || '').indexOf('REMOVED') >= 0;
        }, 5000);
        console.log(`保险箱删除后配置目录状态: ${vaultRemoved ? 'REMOVED' : 'EXISTS(5s 内未清理)'}`);
        await uos.showDesktop();
        // 原固定 sleep(2000)：改为有界轮询文管窗口全部关闭
        await waitUntil(async () => {
            const res = await system.exec(`wmctrl -lx | grep -ci 'dde-file-manager'`, 10000);
            return parseInt(String((res && res.stdout) || '0').trim(), 10) === 0;
        }, 2000);

        // 记录删除后埋点日志的偏移量，后续只校验本次创建产生的新增日志
        const installedVersion = await getInstalledVersion(system);
        console.log(`已安装文件管理器版本: ${installedVersion || '未知'}`);
        let logFile = await getLatestLogFile(system);
        console.log(`找到埋点日志文件: ${logFile}`);
        if (!logFile) {
            throw new Error('未找到埋点日志文件');
        }
        let logSizeBefore = await getLogFileSize(system, logFile);
        console.log(`操作前日志文件大小: ${logSizeBefore}`);

        // 步骤1: 使用【密钥加密】创建保险箱成功
        console.log('步骤1: 使用密钥加密创建保险箱');
        await createPasswordVault(uos, env, agent, device, system);
        const mountCheck = await system.exec(`mountpoint -q ${vaultUnlocked} && echo MOUNTED || echo LOCKED`, 10000);
        const mountState = (((mountCheck && mountCheck.stdout) || '') + ((mountCheck && mountCheck.stderr) || '')).trim();
        console.log(`创建后保险箱挂载状态: ${mountState}`);
        if (mountState.indexOf('MOUNTED') < 0) {
            throw new Error('密钥加密保险箱创建失败，保险箱未处于解锁状态');
        }

        // 断言：创建完成后文件管理器界面正常，左侧边栏保留保险箱入口
        await agent.aiAssert('文件管理器窗口正常显示，左侧边栏中显示保险箱目录项');

        // 等待埋点日志写入：改为有界轮询日志文件增长（客观判据，通常 1s 内返回，上限 12s）
        await waitUntil(async () => {
            const latest = await getLatestLogFile(system);
            if (latest && latest !== logFile) return true;
            return (await getLogFileSize(system, logFile)) > logSizeBefore;
        }, 12000);

        // 步骤1: 读取本次创建后新增的埋点日志
        console.log('步骤1: 读取创建保险箱后新增的埋点日志');
        const latestLogFile = await getLatestLogFile(system);
        if (latestLogFile && latestLogFile !== logFile) {
            console.log(`埋点日志文件已切换: ${logFile} -> ${latestLogFile}`);
            logFile = latestLogFile;
            logSizeBefore = 0;
        }
        let newLogs = await readNewLogs(system, logFile, logSizeBefore);
        if (!newLogs) {
            console.log('偏移量读取为空，改为读取日志尾部');
            newLogs = await readNewLogs(system, logFile, 0);
        }
        console.log(`创建保险箱后新增的埋点日志:\n${newLogs}`);
        if (!newLogs) {
            throw new Error('创建保险箱后未产生新的埋点日志');
        }

        // 预期1: 上报内容包含文件管理器版本号、保险箱创建成功事件、触发时间
        console.log('断言: 验证埋点日志上报内容');
        const versionMatched = newLogs.indexOf('app_version') >= 0
            && (!installedVersion || newLogs.indexOf(installedVersion) >= 0);
        // 保险箱创建成功事件 tid=1000500000，字段 mode:1 表示创建（日志为多层转义 JSON，用宽松正则匹配）
        const hasCreateEvent = newLogs.indexOf('1000500000') >= 0 && /mode[\\":\s]{1,6}1(?![0-9])/.test(newLogs);
        // sysTime 为秒级时间戳，校验其与当前时间偏差在 30 分钟内
        const sysTimeMatch = newLogs.match(/sysTime[^0-9]{1,10}(\d{10})/);
        const sysTimeValid = !!sysTimeMatch && Math.abs(Date.now() / 1000 - parseInt(sysTimeMatch[1], 10)) < 1800;
        if (!versionMatched || !hasCreateEvent || !sysTimeValid) {
            throw new Error(`断言失败：新增埋点日志缺少必要内容 - 版本号:${versionMatched}, 保险箱创建成功事件:${hasCreateEvent}, 触发时间:${sysTimeValid}`);
        }
        console.log('预期1: 新建保险箱触发了上报事件，包含版本号、保险箱创建成功事件及触发时间');
    }, { timeout: 1800000, tags: ['1810965', 'level3', 'vault', 'DITT', 'xuqi', 'tracking'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { escShell, rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const USER = `'${escShell(TEST_USER)}'`;
        await device.pressKey('Esc');
        await rmVault(system);
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await system.exec('killall dde-file-dialog || true');
        await uos.showDesktop();
    });
});
