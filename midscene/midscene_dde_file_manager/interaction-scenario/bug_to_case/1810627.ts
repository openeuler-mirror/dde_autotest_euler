// @ts-nocheck

/**
 * 用例 PMSID: 1810627
 * 用例标题: 【Bug转用例场景】使用2022文本中的内容重命名文件时不会导致文管崩溃
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 提速：窗口就绪/落盘结果改 shell 客观有界轮询（零模型调用），未命中才回落一次原视觉等待
const sh = async (system, cmd, timeout = 10000) => `${((await system.exec(cmd, timeout)) || {}).stdout || ''}`.trim();
const hasTitle = async (system, kw) => parseInt((await sh(system, `wmctrl -l | grep -ic '${kw}' || true`)) || '0', 10) > 0;
const fmWins = async (system) => parseInt((await sh(system, "wmctrl -lx | grep -ci 'dde-file-manager' || true")) || '0', 10) || 0;
const waitUntil = async (fn, timeoutMs = 15000, intervalMs = 500) => {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
        try { if (await fn()) return true; } catch (e) { }
        await sleep(intervalMs);
    }
    return false;
};

describe('1810627-使用2022文本中的内容重命名文件时不会导致文管崩溃', () => {
    const TARGET_DIR = `${TEST_HOME}/Documents`;
    const SRC_FILE = `${TARGET_DIR}/1810627_rename.txt`;
    const CLIP_FILE = `/tmp/1810627_clipboard.txt`;
    // 模拟附件中的 2022 文本内容：含中文、数字、英文与特殊字符，长度控制在单文件名上限内
    const CLIP_TEXT = '2022年测试文本内容：用于验证粘贴重命名文件时不会导致文件管理器崩溃的场景编号1810627_ABCdef!@#$%^&()_+-=[]{}~`';

    beforeAll(async ({ uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await device.pressKey('Esc');
        await system.exec(`rm -f ${SRC_FILE} ${CLIP_FILE}`, 5000);
        await system.exec(`printf '%s' '${CLIP_TEXT}' > ${CLIP_FILE}`, 5000);
        await system.exec(`touch ${SRC_FILE}`, 5000);
        const checkRes = await system.exec(`test -f ${SRC_FILE} && echo OK || echo MISSING`, 5000);
        if ((checkRes.stdout || '').trim().indexOf('OK') < 0) {
            throw new Error('前置条件失败：待重命名文件创建失败');
        }
    });

    test('1810627-使用2022文本中的内容重命名文件时不会导致文管崩溃', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤1：将2022文本内容复制到剪贴板 =====');
        const xclipCheck = await system.exec('command -v xclip >/dev/null 2>&1 && echo YES || echo NO', 5000);
        const xclipAvailable = (xclipCheck.stdout || '').trim().indexOf('YES') >= 0;
        if (xclipAvailable) {
            // xclip 会常驻进程以持有选区，前台执行会挂住远端 shell 并打断远端连接，必须 setsid 后台执行
            const clipEnv = 'export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority; ';
            const setRes = await system.exec(`${clipEnv}setsid xclip -selection clipboard -i ${CLIP_FILE} >/dev/null 2>&1 & sleep 1; echo CLIP_SET`, 15000);
            if ((setRes.stdout || '').indexOf('CLIP_SET') < 0) {
                throw new Error('步骤1失败：写入系统剪贴板失败');
            }
            const getRes = await system.exec(`${clipEnv}xclip -selection clipboard -o`, 10000);
            const clipContent = (getRes.stdout || '').trim();
            console.log(`剪贴板内容长度: ${clipContent.length}`);
            if (clipContent.length === 0) {
                throw new Error('步骤1失败：剪贴板内容为空');
            }
            console.log('✅ 步骤1通过：文本内容已复制到剪贴板');
        } else {
            console.log('系统未安装 xclip，改用键盘输入等价文本内容');
        }

        console.log('===== 步骤2：在文管中选中文件并进入重命名 =====');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        if (!(await waitUntil(async () => (await fmWins(system)) > 0, 15000))) {
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
        }
        await agent.aiTap('文件管理器左侧栏的文档');
        if (!(await waitUntil(() => hasTitle(system, '文档'), 15000))) {
            await agent.aiWaitFor('文档目录已打开', { timeoutMs: 20000 });
        }
        await agent.aiTap('文档目录中的1810627_rename.txt文件');
        await agent.aiWaitFor('1810627_rename.txt 文件已被选中');
        await device.pressKey('F2');
        await agent.aiWaitFor('进入文件重命名编辑状态，文件名输入框已获得焦点', { timeoutMs: 20000 });
        console.log('✅ 步骤2通过：进入重命名状态');

        console.log('===== 步骤3：粘贴文本内容并保存 =====');
        await device.pressKey('ctrl+a');
        await sleep(500);
        let pasted = false;
        if (xclipAvailable) {
            await device.pressKey('ctrl+v');
            await sleep(1000);
            // 粘贴结果需验证，xclip 剪贴板与远程粘贴通道可能不一致（失败实证：ctrl+v 后重命名框无内容）
            pasted = await agent.aiBoolean('重命名输入框中显示了以2022年测试文本内容开头的文本');
        }
        if (!pasted) {
            console.log('ctrl+v 粘贴未生效，改用 typeText（内部走远程剪贴板+Ctrl+V）输入等价文本');
            await device.pressKey('ctrl+a');
            await sleep(300);
            await device.typeText(CLIP_TEXT);
            await sleep(1000);
        }
        await device.pressKey('Enter');
        // 提速：原固定 3s 盲等改为 ls 有界轮询，重命名落盘即返回
        await waitUntil(async () => parseInt((await sh(system, `ls -1 ${TARGET_DIR} | grep -c '2022年测试文本内容'`)) || '0', 10) > 0, 5000, 500);

        // 预期3：重命名成功，文管没有崩溃
        const renamedRes = await system.exec(`ls -1 ${TARGET_DIR} | grep -c '2022年测试文本内容'`, 10000);
        const renamedCount = parseInt((renamedRes.stdout || '0').trim(), 10);
        console.log(`重命名后匹配文件数量: ${renamedCount}`);
        if (renamedCount < 1) {
            throw new Error('断言失败：使用粘贴文本重命名文件失败');
        }
        console.log('✅ 预期3通过：重命名成功');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        const pidCount = parseInt((pidRes.stdout || '0').trim(), 10);
        console.log(`dde-file-manager 进程数: ${pidCount}`);
        if (pidCount < 1) {
            throw new Error('断言失败：文管进程已退出（重命名导致崩溃）');
        }
        await agent.aiTap('文件管理器左侧栏的主目录');
        if (!(await waitUntil(() => hasTitle(system, '主目录'), 15000))) {
            await agent.aiWaitFor('主目录内容正常显示', { timeoutMs: 30000 });
        }
        await agent.aiAssert('文件管理器窗口正常显示，界面没有卡死或崩溃');
        console.log('✅ 断言通过：文管未崩溃且窗口可正常响应');

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1200000, tags: ['1810627', 'level3', 'interaction-scenario', 'bug_to_case', 'rename', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await system.exec('killall xclip 2>/dev/null; echo done', 5000);
        await system.exec(`rm -f ${SRC_FILE} ${CLIP_FILE}`, 5000);
        await system.exec(`find ${TARGET_DIR} -maxdepth 1 -name '2022年测试文本内容*' -delete`, 10000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await system.exec(`rm -f ${SRC_FILE} ${CLIP_FILE}`, 5000);
        await system.exec(`find ${TARGET_DIR} -maxdepth 1 -name '2022年测试文本内容*' -delete`, 10000);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
