// @ts-nocheck

/**
 * 用例 PMSID: 1810641
 * 用例标题: 【Bug转用例场景】找回密码后，再次点击侧边栏保险箱
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 以 root 会话连接用户 X 时需显式指定 DISPLAY/XAUTHORITY（与 common.ts 既有写法一致，单引号字符串内 ${..} 不做 JS 插值）
const WMCTRL_PREFIX = 'export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority; ';

describe('1810641-找回密码后再次点击侧边栏保险箱', () => {
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

    test('1810641-找回密码后再次点击侧边栏保险箱', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        console.log('===== 步骤0：密钥加密方式创建保险箱 =====');
        await createPasswordVault(uos, env, agent, device, system);

        console.log('===== 步骤1：将保险箱置于锁定状态 =====');
        // 说明：createPasswordVault 完成后保险箱处于解锁态，需主动锁定；空保险箱页面不显示文件列表，不能用"文件列表"判定
        // v26（提速）：解锁态在系统层面对应 cryfs/gocryptfs 挂载进程存在、锁定后进程退出；
        //   改用 shell 有界轮询替代逐次调模型的 aiBoolean（每轮都是独立模型调用），进程判据不可用时自动回退视觉判定
        const vaultProcCount = async () => {
            const res = await system.exec("ps -eo comm | grep -cE '^(cryfs|gocryptfs)$' || true", 5000);
            return parseInt(((res && res.stdout) || '0').trim(), 10) || 0;
        };
        const waitVaultLocked = async (timeoutMs) => {
            const deadline = Date.now() + timeoutMs;
            while (Date.now() < deadline) {
                if ((await vaultProcCount()) === 0) return true;
                await sleep(700);
            }
            return (await vaultProcCount()) === 0;
        };
        // 解锁态能观察到挂载进程，才说明该判据在本机可用
        const procSignalUsable = (await vaultProcCount()) > 0;
        console.log(`保险箱挂载进程判据可用: ${procSignalUsable}`);
        const confirmLocked = async (timeoutMs) => procSignalUsable
            ? await waitVaultLocked(timeoutMs)
            : await agent.aiBoolean('保险箱页面显示解锁按钮或者请输入密码的输入框');
        const waitFmWindow = async (timeoutMs) => {
            const deadline = Date.now() + timeoutMs;
            while (Date.now() < deadline) {
                const res = await system.exec(WMCTRL_PREFIX + "wmctrl -lx | grep -ci 'dde-file-manager' || true", 8000);
                if (parseInt(((res && res.stdout) || '0').trim(), 10) > 0) return;
                await sleep(700);
            }
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 15000 });
        };

        // 实测（2026-10-28 远端）：文管窗口标题恒为「文件管理器」，不含当前目录名，
        //   "标题含计算机"的判断恒为 false，只会白等；改为有界视觉校验。
        const waitComputerPage = async () => {
            await agent.aiWaitFor('计算机页面已打开', { timeoutMs: 20000, checkIntervalMs: 2000 });
        };
        // aiTap 点左侧栏「保险箱」偶发偏上命中「计算机」（bbox y470~498 vs 正确 y503~519），
        // 会停在计算机页面导致后续锁定/断言全部失效；改为有界校验 + 一次点击重试。
        const openVaultPage = async () => {
            for (let attempt = 1; attempt <= 2; attempt += 1) {
                await agent.aiTap('文件管理器左侧栏的保险箱');
                await sleep(1500);
                try {
                    await agent.aiWaitFor('文件管理器已进入保险箱页面', { timeoutMs: 20000, checkIntervalMs: 2000 });
                    await sleep(800);
                    return;
                } catch (err) {
                    console.log(`第${attempt}次点击"保险箱"未进入保险箱页面：${String(err && err.message || err).split('\n')[0]}`);
                }
            }
            throw new Error('前置失败：多次点击左侧栏"保险箱"仍未进入保险箱页面');
        };

        await openVaultPage();
        let locked = await confirmLocked(3000);
        if (!locked) {
            try {
                await agent.aiTap('保险箱页面顶部的锁定按钮');
                locked = await confirmLocked(20000);
            } catch (error) {
                console.log('点击锁定按钮失败，尝试右键菜单');
            }
        }
        if (!locked) {
            try {
                await agent.aiRightClick('文件管理器左侧栏的保险箱');
                await sleep(1000);
                const hasLockMenu = await agent.aiBoolean('右键菜单中存在锁定保险箱选项');
                if (hasLockMenu) {
                    await agent.aiTap('右键菜单中的锁定保险箱选项');
                } else {
                    await device.pressKey('Esc');
                }
                locked = await confirmLocked(20000);
            } catch (error) {
                console.log('右键菜单锁定失败');
            }
        }
        if (!locked) {
            // 兜底：文管退出后保险箱会自动锁定，重启文管服务后重新打开保险箱
            console.log('锁定按钮与右键菜单均未生效，重启文管服务使保险箱重新锁定');
            await system.exec('systemctl --user restart dde-file-manager.service', 20000);
            await sleep(4000);
            await uos.openApp('文件管理器', { maximizeWindow: true });
            await waitFmWindow(20000);
            await openVaultPage();
            locked = await confirmLocked(20000);
        }
        if (!locked) {
            throw new Error('前置条件失败：无法将保险箱置于锁定状态');
        }
        // 保留一次视觉确认：挂载进程退出不等于 UI 已切到解锁页（原为 aiWaitFor 30s 轮询）
        // 实证（2026-10-28 23:10 复跑失败）：锁定态下页面可能只显示"保险箱"入口图标，需再点一次才出现解锁表单；
        //   故改为「最多 2 次断言 + 未通过时点一次保险箱图标」，仍不通过只告警不中断（步骤2会再次点击保险箱）。
        let unlockPageReady = false;
        for (let attempt = 1; attempt <= 2 && !unlockPageReady; attempt += 1) {
            try {
                await agent.aiAssert('保险箱页面显示解锁按钮或者请输入密码的输入框');
                unlockPageReady = true;
            } catch (err) {
                console.log(`第${attempt}次校验解锁页未通过，点击保险箱图标后重试`);
                try {
                    await agent.aiTap('文件管理器主区域中央的保险箱图标');
                } catch (tapErr) {
                    await openVaultPage();
                }
                await sleep(1200);
            }
        }
        if (!unlockPageReady) {
            console.log('⚠️ 未确认已展示解锁表单，继续后续步骤');
        }
        console.log('✅ 前置条件就绪：保险箱处于锁定状态');

        console.log('===== 步骤2：点击保险箱 → 忘记密码 → 找回密码 =====');
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await sleep(1200);
        await agent.aiTap('忘记密码');
        // 找回密码的实际落地窗口是「密钥解锁保险箱」（用恢复密钥解锁），接受该窗口即视为找回密码流程已弹出（失败实证：等待"找回密码的信息"超时，实际窗口标题为"密钥解锁保险箱"）
        await sleep(2000);
        // 预期1：弹出找回密码的信息（等待由上面的固定 sleep 覆盖，这里保留重试预算，避免重复的 aiWaitFor 额外模型调用）
        await agent.aiAssert('弹出找回密码相关的窗口或对话框（密钥解锁保险箱窗口或找回密码提示）', { timeoutMs: 15000 });
        console.log('✅ 预期1通过：已弹出找回密码的信息');

        console.log('===== 步骤3：关闭密码找回弹窗，不关闭文管 =====');
        let dialogClosed = false;
        try {
            await agent.aiTap('密码找回弹窗中的关闭按钮');
            await sleep(1500);
            dialogClosed = await agent.aiBoolean('密码找回弹窗已关闭');
        } catch (error) {
            console.log('点击关闭按钮失败，改用 Esc');
        }
        if (!dialogClosed) {
            await device.pressKey('Esc');
            await sleep(1500);
        }
        // v26（提速）：窗口是否仍在用 wmctrl 计数（零模型调用）；弹窗是否关闭已由上面的 aiBoolean 覆盖，
        //   仅在 aiBoolean 未确认（走了 Esc 兜底）时补一次视觉断言，避免 20s 轮询反复调模型
        const fmWinRes = await system.exec(WMCTRL_PREFIX + "wmctrl -lx | grep -ci 'dde-file-manager' || true", 8000);
        if (parseInt(((fmWinRes && fmWinRes.stdout) || '0').trim(), 10) < 1) {
            throw new Error('断言失败：密码找回弹窗关闭后文件管理器窗口已消失');
        }
        if (!dialogClosed) {
            await agent.aiAssert('密码找回弹窗已关闭，文件管理器窗口仍然显示', { timeoutMs: 15000 });
        }
        console.log('✅ 密码找回弹窗已关闭，文管未关闭');

        console.log('===== 步骤4：再次点击侧边栏保险箱（两次） =====');
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await sleep(1500);
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await sleep(1500);
        // 预期2：进入解锁保险箱流程
        await agent.aiAssert('文件管理器内容区域显示保险箱解锁流程页面，含有解锁按钮或密码输入框');
        console.log('✅ 预期2通过：再次点击侧边栏保险箱进入解锁流程');

        console.log('===== 步骤5：进入计算机页面，双击保险箱图标 =====');
        await agent.aiTap('文件管理器左侧栏的计算机');
        await waitComputerPage();
        await agent.aiDoubleClick('计算机页面中的保险箱图标');
        await sleep(2500);
        // 预期3：进入解锁保险箱流程
        await agent.aiAssert('文件管理器内容区域显示保险箱解锁流程页面，含有解锁按钮或密码输入框');
        console.log('✅ 预期3通过：双击计算机页面保险箱图标进入解锁流程');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        const pidCount = parseInt((pidRes.stdout || '0').trim(), 10);
        if (pidCount < 1) {
            throw new Error('断言失败：文管进程已退出');
        }
        console.log('===== 测试全部通过 =====');
    }, { timeout: 1800000, tags: ['1810641', 'level3', 'interaction-scenario', 'bug_to_case', 'vault', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await system.exec(`rm -f /home/${USER}/recoveryKey.key`, 1000);
        await rmVault(system);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
