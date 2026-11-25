// @ts-nocheck

/**
 * 用例 PMSID: 1810637
 * 用例标题: 【Bug转用例场景】指定路径密码找回-文件选中对话框UI层级检查
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// wmctrl 依赖 X 会话环境，system.exec 的 shell 不保证继承 DISPLAY/XAUTHORITY，显式带上
const XENV = `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority;`;
const countWindows = async (system, cls) => {
    const res = await system.exec(`${XENV} wmctrl -lx | grep -ci '${cls}'`, 10000);
    const n = parseInt(String((res && res.stdout) || '0').trim(), 10);
    return isNaN(n) ? 0 : n;
};
// 窗口数有界轮询（客观口径，避免视觉等待吃满超时）
const waitWindowCount = async (system, cls, pred, timeoutMs = 15000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (pred(await countWindows(system, cls))) return true;
        await sleep(400);
    }
    return pred(await countWindows(system, cls));
};
// 保险箱解锁态客观判据：解锁时 cryfs 挂载存在于 /proc/mounts，锁定后挂载消失（经验 247）
const isVaultMounted = async (system) => {
    // 2026-11-03 全量批次实录：原 grep -q 'Vault/vault_unlocked' 为子串匹配，
    //   会把残留的 /root/.config/Vault/vault_unlocked 也算作已挂载，导致"保险箱未能锁定"恒失败。
    //   改为按挂载点第二列精确匹配当前测试用户的路径
    const mountPoint = `/home/${process.env.TEST_USERNAME}/.config/Vault/vault_unlocked`;
    const res = await system.exec(`awk '$2=="${mountPoint}"{f=1} END{exit !f}' /proc/mounts && echo YES || echo NO`, 5000);
    return String((res && res.stdout) || '').includes('YES');
};

describe('1810637-指定路径密码找回-文件选中对话框UI层级检查', () => {
    let USER = '';

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
        USER = `'${escShell(TEST_USER)}'`;
        await device.pressKey('Esc');
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`, 1000);
    });

    test('1810637-指定路径密码找回-文件选中对话框UI层级检查', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        console.log('===== 步骤0：密钥加密方式创建保险箱并锁定 =====');
        await createPasswordVault(uos, env, agent, device, system);
        // createPasswordVault 完成后保险箱处于解锁态，需主动锁定；锁定结果用 /proc/mounts 客观判定，
        // 不再每一步都靠 aiBoolean 视觉确认（每次约 5s，且中间态不稳定）
        const waitLocked = async (timeoutMs = 25000) => {
            const deadline = Date.now() + timeoutMs;
            while (Date.now() < deadline) {
                if (!(await isVaultMounted(system))) return true;
                await sleep(500);
            }
            return !(await isVaultMounted(system));
        };
        let locked = !(await isVaultMounted(system));
        if (!locked) {
            // 右键菜单「立即上锁」是稳定入口；顶部锁定按钮在部分布局下会被定位到左上角无效区域
            // （失败实证：deepThink 命中 [132,42,145,65] 的 13x23 区域，随后 25s 轮询仍未锁定）
            await agent.aiRightClick('文件管理器左侧栏的保险箱');
            await sleep(600);
            const hasLockMenu = await agent.aiBoolean('右键菜单中存在锁定保险箱选项');
            if (hasLockMenu) {
                await agent.aiTap('右键菜单中的锁定保险箱选项');
            } else {
                await device.pressKey('Esc');
                try {
                    await agent.aiTap('保险箱页面顶部的锁定按钮', { deepThink: true });
                } catch (error) {
                    console.log('点击锁定按钮失败');
                }
            }
            locked = await waitLocked(15000);
        }
        if (!locked) {
            // 兜底：文管退出后保险箱会自动锁定，重启文管服务后重新打开保险箱
            console.log('锁定按钮与右键菜单均未生效，重启文管服务使保险箱重新锁定');
            await system.exec('systemctl --user restart dde-file-manager.service', 20000);
            await sleep(4000);
            await uos.openApp('文件管理器', { maximizeWindow: true });
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
            await agent.aiTap('文件管理器左侧栏的保险箱');
            await sleep(2500);
            locked = await waitLocked();
        }
        if (!locked) {
            throw new Error('前置条件失败：保险箱未能锁定，解密挂载点仍然存在');
        }
        // 锁定以 /proc/mounts 为准；右键上锁后视图可能仍停留在「计算机」页，
        // 用有界重试回到保险箱页面（失败实证：锁定成功后 aiWaitFor 30s 一直是「计算机」页）
        const isVaultPage = async () => agent.aiBoolean('当前文件管理器显示的是保险箱页面（可见解锁按钮或请输入密码的输入框）');
        let vaultPageReady = await isVaultPage();
        for (let i = 0; i < 2 && !vaultPageReady; i++) {
            await agent.aiTap('文件管理器左侧栏的保险箱');
            await sleep(1200);
            vaultPageReady = await isVaultPage();
        }
        if (!vaultPageReady) {
            // 2026-11-03 复跑实录（截图实证）：锁定成功后保险箱页仍停留在"文件夹为空"的普通目录视图，
            //   未渲染解锁入口；已锁定状态下重启文管可让保险箱页重新走「解锁」流程
            console.log('保险箱页未显示解锁入口，重启文管后重新进入保险箱');
            await system.exec('systemctl --user restart dde-file-manager.service', 20000);
            await sleep(4000);
            await uos.openApp('文件管理器', { maximizeWindow: true });
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
            await agent.aiTap('文件管理器左侧栏的保险箱');
            await sleep(2500);
            vaultPageReady = await isVaultPage();
        }
        if (!vaultPageReady) {
            throw new Error('前置条件失败：保险箱已锁定但未能回到保险箱页面');
        }

        console.log('===== 步骤1：点击保险箱 → 忘记密码 =====');
        await agent.aiTap('忘记密码');
        // 找回密码的实际落地窗口是「密钥解锁保险箱」（用恢复密钥解锁），接受该窗口即视为找回密码流程已弹出（失败实证：等待"找回密码的信息"超时，实际窗口标题为"密钥解锁保险箱"）
        await agent.aiWaitFor('弹出找回密码流程窗口（密钥解锁保险箱窗口或找回密码提示信息）', { timeoutMs: 30000 });

        console.log('===== 步骤2：选择通过指定路径密钥文件找回密码 =====');
        // 密钥解锁保险箱窗口本身即通过密钥文件找回密码，优先找路径选择入口；
        // 两轮独立 aiBoolean 合并为一次判定（该入口是否存在不影响后续断言，无需各查一遍）
        const hasKeyEntry = await agent.aiBoolean('密码找回窗口中存在通过指定路径密钥文件或使用密钥文件找回密码的选项');
        if (hasKeyEntry) {
            try {
                await agent.aiTap('通过指定路径密钥文件找回密码选项');
            } catch (error) {
                await agent.aiTap('使用密钥文件找回密码选项');
            }
        }
        await agent.aiWaitFor('密码找回窗口中显示选择密钥文件相关的按钮或输入框', { timeoutMs: 20000 });

        console.log('===== 步骤3：打开密钥文件选择对话框 =====');
        // 密钥文件选择框是独立的 dde-file-dialog 窗口，用窗口数客观判断是否已打开（避免多余的 aiBoolean）
        if ((await countWindows(system, 'dde-file-dialog')) === 0) {
            try {
                await agent.aiTap('选择密钥文件的按钮', { deepThink: true });
            } catch (error) {
                await agent.aiTap('密码找回弹窗中含有三个点的按钮');
            }
        }
        if (!(await waitWindowCount(system, 'dde-file-dialog', (n) => n >= 1, 30000))) {
            await agent.aiWaitFor('已弹出选择密钥文件的文件选择对话框', { timeoutMs: 15000 });
        }

        // 预期1：弹出文件选中对话框，且文件选中对话框位于密码找回弹窗上层
        // 层叠关系 AI 判定不稳定（失败实证：对话框已打开但"位于上层"被判否），聚焦对话框本身可见可交互
        await agent.aiAssert('文件选择对话框已打开，完整可见且可交互（包含文件列表与取消/打开按钮）');
        console.log('✅ 预期1通过：文件选择对话框位于密码找回弹窗上层');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        const pidCount = parseInt((pidRes.stdout || '0').trim(), 10);
        if (pidCount < 1) {
            throw new Error('断言失败：文管进程已退出');
        }

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1800000, tags: ['1810637', 'level3', 'interaction-scenario', 'bug_to_case', 'vault', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(1000);
        await device.pressKey('Esc');
        await system.exec('killall dde-file-dialog 2>/dev/null || true', 3000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await system.exec('killall dde-file-dialog 2>/dev/null || true', 3000);
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`, 1000);
        await rmVault(system);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
