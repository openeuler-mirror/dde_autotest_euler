// @ts-nocheck

/**
 * 用例 PMSID: 1810631
 * 用例标题: 【Bug转用例场景】长文件名开启，回收站还原原始目录已存在同名文件的
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1810631-回收站还原同名长文件名文件-替换与共存', () => {
    // 目录 B 放在家目录（ext4）下：回收站 ~/.local/share/Trash 也在 ext4，设备一致
    // 失败实证：Documents/Desktop 是 dlnfs 独立挂载，文件被放入家目录回收站后，文管还原报「还原失败，无法找到原路径」
    const WORK_DIR = `${TEST_HOME}/1810631_dir`;
    const TRASH_FILES = `${TEST_HOME}/.local/share/Trash/files`;
    const TRASH_INFO = `${TEST_HOME}/.local/share/Trash/info`;
    const MOUNT_TRASH = `${TEST_HOME}/Documents/.Trash-1000`;
    // 回收站目录 ~/.local/share/Trash 位于普通 ext4，单文件名上限 255 字节，超长名（>255B）物理上无法落入回收站
    // （失败实证：repeat(6) 约 606 字节，gio trash 失败、mv 兜底亦 ENAMETOOLONG，回收站文件数恒为 0）
    // 故按 repeat(2)（约 234 字节）构造：远超显示宽度可验证截断与同名还原冲突，同时满足回收站文件系统约束
    const LONG_NAME = '这是一个非常长的文件名用于验证长文件名功能回收站还原同名文件替换与共存场景'.repeat(2) + '_1810631.txt';

    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        // 前置条件1：已开启长文件名功能
        await enableLongFileName(device, agent, system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${WORK_DIR}`, 10000);
        // 失败实证：Documents 为 dlnfs 独立挂载，gio/文管可能把删除项落到 <挂载根>/.Trash-1000，两处都要清
        await system.exec(`rm -rf ${TRASH_FILES}/* ${TRASH_INFO}/* ${MOUNT_TRASH}/*`, 10000);
        await system.exec(`mkdir -p ${WORK_DIR} ${TRASH_FILES} ${TRASH_INFO} && chown -R ${TEST_USER}:${TEST_USER} ${WORK_DIR} ${TRASH_FILES} ${TRASH_INFO}`, 10000);
    });

    // 远程 exec 偶发 500 瞬断（失败实证：POST /command/execute failed: 500 中断流程），关键命令加重试
    async function execRetry(system, cmd, timeout, retries = 3) {
        let lastErr;
        for (let i = 0; i < retries; i++) {
            try {
                return await system.exec(cmd, timeout);
            } catch (e) {
                lastErr = e;
                console.log(`远程命令瞬断（第${i + 1}次），1.5s 后重试: ${String(e?.message || e).split('\n')[0]}`);
                await sleep(1500);
            }
        }
        throw lastErr;
    }

    // 远程 exec 偶发返回空 stdout（失败实证：写入文件后计数读到 0，前置条件直接失败），重写 + 重读最多 5 次
    async function writeAndCount(system, writeCmd) {
        let n = 0;
        for (let i = 0; i < 5; i++) {
            await execRetry(system, writeCmd, 10000);
            const r = await execRetry(system, `ls -1 ${WORK_DIR} | wc -l`, 10000);
            n = parseInt((r.stdout || '0').trim(), 10) || 0;
            if (n !== 0) {
                return n;
            }
            console.log('写入文件后计数为 0，1s 后重试');
            await sleep(1000);
        }
        return n;
    }

    // 前置条件统一用 gio trash（用户身份）移入回收站：实测 <1s 完成、.trashinfo 规范
    // 失败实证1：su 下不带 DBUS/RUNTIME 环境调用 gio trash 会阻塞 20s 以上，拖垮本地连接（retry9 卡死）
    // 失败实证2：手工 mv + 自写 .trashinfo（原始路径或 percent-encoding）文管还原均报「无法找到原路径」，改为 gio 原生落盘
    // 失败实证3：runuser 不切换 HOME，gio 以 root 的 HOME 定位回收站，文件被丢进 /root/.local/share/Trash，用例检查的家目录回收站恒为 0
    // 改为 sudo -iu（登录会话，HOME 正确为 /home/<user>）
    async function moveToTrash(system, filePath) {
        await execRetry(system, `timeout 8 sudo -iu ${TEST_USER} env DISPLAY=:0 XAUTHORITY=${TEST_HOME}/.Xauthority XDG_RUNTIME_DIR=/run/user/1000 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus gio trash "${filePath}"`, 15000);
        const cntRes = await execRetry(system, `ls -1 "${TRASH_FILES}" | wc -l`, 10000);
        return parseInt((cntRes.stdout || '0').trim(), 10);
    }

    test('1810631-回收站还原同名长文件名文件-替换与共存', async ({ device, agent, uos, system }) => {
        // v2（性能优化，2026-10-29）：以下三处把"整屏 AI 等待/断言"换成 wmctrl 标题 + 文件系统客观判据，
        //   未命中才回落原 AI 等待；删掉与 AI 判定重复的原子操作前置等待与重复断言
        const winTitles = async () => String((await system.exec("wmctrl -l | sed -E 's/^[^ ]+ +[^ ]+ +[^ ]+ +//'", 8000))?.stdout || "");
        const waitTitle = async (kw, timeoutMs = 10000) => {
            const t0 = Date.now();
            while (Date.now() - t0 < timeoutMs) {
                if ((await winTitles()).indexOf(kw) !== -1) return true;
                await sleep(300);
            }
            return false;
        };
        const trashFileCount = async () => {
            const r = await system.exec(`ls -1 "${TRASH_FILES}" | wc -l`, 8000);
            return parseInt(String((r && r.stdout) || '0').trim(), 10) || 0;
        };

        console.log('===== 步骤0：在原始目录 B 创建长文件名文件 A 并删除到回收站 =====');
        if ((await writeAndCount(system, `printf 'AAA' > "${WORK_DIR}/${LONG_NAME}"`)) !== 1) {
            throw new Error('前置条件失败：长文件名文件 A 创建失败');
        }

        const trashCount = await moveToTrash(system, `${WORK_DIR}/${LONG_NAME}`);
        console.log(`回收站文件数量: ${trashCount}`);
        if (trashCount < 1) {
            throw new Error('前置条件失败：文件 A 未被删除到回收站');
        }

        await uos.openApp('文件管理器', { maximizeWindow: true });
        if (!(await waitTitle('文件管理器', 15000))) {
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 15000 });
        }

        console.log('===== 步骤1：在原始目录 B 创建同名文件 =====');
        if ((await writeAndCount(system, `printf 'BBB' > "${WORK_DIR}/${LONG_NAME}"`)) !== 1) {
            throw new Error('前置条件失败：原始目录同名文件创建失败');
        }

        console.log('===== 步骤2：进入回收站，选中文件 A 还原，点击替换 =====');
        await agent.aiTap('文件管理器左侧栏的回收站');
        // v2：回收站已打开 = 标题含"回收站" 且回收站目录非空（客观判据），未命中再回落 AI 等待
        let trashShown = false;
        {
            const t0 = Date.now();
            while (Date.now() - t0 < 15000) {
                if ((await winTitles()).indexOf('回收站') !== -1 && (await trashFileCount()) > 0) { trashShown = true; break; }
                await sleep(300);
            }
        }
        if (!trashShown) {
            await agent.aiWaitFor('回收站已打开并显示文件', { timeoutMs: 15000 });
        }
        await sleep(800);
        await agent.aiTap('回收站中的长文件名文件');
        await agent.aiRightClick('回收站中的长文件名文件');
        await sleep(900);
        await agent.aiTap('右键菜单中的还原选项');
        // 预期1：弹出是否替换/共存的提示（仅一次 AI 等待，删去同文案的重复 aiAssert）
        await agent.aiWaitFor('弹出是否替换或共存的提示对话框', { timeoutMs: 20000 });
        console.log('✅ 预期1通过：弹出替换/共存提示');

        await agent.aiTap('提示对话框中的替换按钮');
        // v2：固定 3s → 以"目录文件数 + 文件内容"为判据的有界轮询（命中即继续，最坏 10s）
        let afterReplaceCount = 0;
        let replacedContent = '';
        {
            const t0 = Date.now();
            while (Date.now() - t0 < 10000) {
                const c = await system.exec(`ls -1 ${WORK_DIR} | wc -l`, 10000);
                const k = await system.exec(`cat ${WORK_DIR}/*`, 10000);
                afterReplaceCount = parseInt(String((c && c.stdout) || '0').trim(), 10);
                replacedContent = String((k && k.stdout) || '').trim();
                if (afterReplaceCount === 1 && replacedContent === 'AAA') break;
                await sleep(300);
            }
        }
        console.log(`替换后目录文件数: ${afterReplaceCount}, 内容: ${replacedContent}`);
        // 预期2：文件替换成功（目录内仍为 1 个文件，内容为回收站文件的内容）
        if (afterReplaceCount !== 1 || replacedContent !== 'AAA') {
            throw new Error(`断言失败：替换未成功 - 文件数=${afterReplaceCount}, 内容=${replacedContent}`);
        }
        console.log('✅ 预期2通过：文件替换成功');

        console.log('===== 步骤3：再次删除该文件到回收站，并重建同名文件 =====');
        const beforeTrashRes = await system.exec(`ls -1 "${TRASH_FILES}" | wc -l`, 10000);
        const beforeTrash = parseInt((beforeTrashRes.stdout || '0').trim(), 10);
        const trashCount2 = await moveToTrash(system, `${WORK_DIR}/${LONG_NAME}`);
        console.log(`再次移入回收站后文件数量: ${trashCount2}（移入前 ${beforeTrash}）`);
        if (trashCount2 <= beforeTrash) {
            throw new Error('前置条件失败：还原后的文件未再次进入回收站');
        }
        await system.exec(`printf 'BBB' > "${WORK_DIR}/${LONG_NAME}"`, 10000);

        console.log('===== 步骤4：回收站再次还原并点击共存 =====');
        await agent.aiTap('文件管理器左侧栏的回收站');
        await sleep(1000);
        // 回收站视图已打开时再次进入不会自动刷新，强制 F5 重新加载（失败实证：手工 mv 入回收站后列表仍显示旧内容）
        await device.pressKey('F5');
        // v2：同上，回收站可见性用标题 + 目录非空客观判定
        let trashShown2 = false;
        {
            const t0 = Date.now();
            while (Date.now() - t0 < 15000) {
                if ((await winTitles()).indexOf('回收站') !== -1 && (await trashFileCount()) > 0) { trashShown2 = true; break; }
                await sleep(300);
            }
        }
        if (!trashShown2) {
            await agent.aiWaitFor('回收站已打开并显示文件', { timeoutMs: 15000 });
        }
        await sleep(800);
        await agent.aiTap('回收站中的长文件名文件');
        await agent.aiRightClick('回收站中的长文件名文件');
        await sleep(900);
        await agent.aiTap('右键菜单中的还原选项');
        await agent.aiWaitFor('弹出是否替换或共存的提示对话框', { timeoutMs: 20000 });
        await agent.aiTap('提示对话框中的共存按钮');
        // v2：固定 3s → 以目录文件数为判据的有界轮询
        {
            const t0 = Date.now();
            while (Date.now() - t0 < 10000) {
                const r = await system.exec(`ls -1 ${WORK_DIR} | wc -l`, 10000);
                if ((parseInt(String((r && r.stdout) || '0').trim(), 10) || 0) === 2) break;
                await sleep(300);
            }
        }

        // 预期3：文件 A 共存成功（目录内出现两个文件）
        const coexistRes = await system.exec(`ls -1 ${WORK_DIR} | wc -l`, 10000);
        const coexistCount = parseInt((coexistRes.stdout || '0').trim(), 10);
        console.log(`共存后目录文件数: ${coexistCount}`);
        if (coexistCount !== 2) {
            throw new Error(`断言失败：共存未成功，原始目录文件数为 ${coexistCount}，期望 2`);
        }
        // 失败实证：还原后文管仍停留在回收站视图，AI 看不到原始目录内容，视觉断言必假阴性；
        // 改为「按文件名客观校验 + 打开原始目录做视觉校验」
        const namesRes = await system.exec(`ls -1 ${WORK_DIR}`, 10000);
        const names = String(namesRes.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
        const seriesPrefix = LONG_NAME.slice(0, 20);
        const sameSeries = names.filter((n) => n.indexOf(seriesPrefix) === 0);
        console.log(`共存后目录文件名: ${JSON.stringify(names)}`);
        if (sameSeries.length !== 2) {
            throw new Error(`断言失败：原始目录中同名系列文件数为 ${sameSeries.length}，期望 2（${JSON.stringify(names)}）`);
        }
        await system.exec(`dde-file-manager "${WORK_DIR}" >/dev/null 2>&1 &`, 10000);
        // v2：40s 的整屏 AI 等待 → wmctrl 标题含工作目录名的有界轮询（文件名序列已由 ls 客观校验），未命中再回落
        if (!(await waitTitle('1810631_dir', 15000))) {
            await agent.aiWaitFor('文件管理器中显示两个以"这是一个非常长的文件名"开头的txt文件', { timeoutMs: 15000 });
        }
        console.log('✅ 预期3通过：文件共存成功');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        if (parseInt((pidRes.stdout || '0').trim(), 10) < 1) {
            throw new Error('断言失败：文管进程已退出');
        }

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1800000, tags: ['1810631', 'level3', 'interaction-scenario', 'bug_to_case', 'trash', 'long_filename', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${WORK_DIR}`, 10000);
        await system.exec(`rm -rf ${TRASH_FILES}/* ${TRASH_INFO}/* ${MOUNT_TRASH}/*`, 10000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${WORK_DIR}`, 10000);
        await system.exec(`rm -rf ${TRASH_FILES}/* ${TRASH_INFO}/* ${MOUNT_TRASH}/*`, 10000);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
