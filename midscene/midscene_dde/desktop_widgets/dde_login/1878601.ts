/**
 * 用例 PMSID: 1878601
 * 用例标题:【桌面】【登录】【密码错误】连续输入5次错误密码
 * 生成时间: 2026-08-27
 * 用例编写人: UT002485（卢燕）
 */

describe('1878601-【桌面】【登录】【密码错误】连续输入5次错误密码', () => {
    const testUserName = 'testuser';
    const testUserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        // 重置PAM失败计数器并重启认证服务，清除之前测试残留的锁定状态
        await system.exec(`echo '${passWord}' | sudo faillog --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally2 --reset --user uos 2>/dev/null || true`);
        // 恢复：如果停留在锁屏或登录界面，先登录回桌面
        try {
            const isAtDesktop = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
            if (!isAtDesktop) {
                // 尝试通过系统命令解锁
                await system.exec('loginctl unlock-sessions 2>/dev/null || true');
                await system.exec('killall dde-lock 2>/dev/null || true');
                await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
                await new Promise(resolve => setTimeout(resolve, 3000));
                // 检查是否已到桌面
                const isAtDesktopNow = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
                if (!isAtDesktopNow) {
                    // 仍在锁屏/登录界面，尝试通过UI登录
                    const hasPasswordInput = await agent.aiBoolean('界面显示密码输入框');
                    if (!hasPasswordInput) {
                        try {
                            await agent.aiTap('用户头像或解锁按钮');
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        } catch (e) {}
                    }
                    await device.typeAscii(process.env.TEST_PASSWORD);
                    await device.pressKey('Enter');
                    await new Promise(resolve => setTimeout(resolve, 8000));
                }
            }
        } catch (e) {}
        await uos.showDesktop();
        const createUserCmd = `echo '${passWord}' | sudo useradd -m ${testUserName} -s /usr/bin/bash`;
        await system.exec(createUserCmd);
        const setPasswordCmd = `echo '${passWord}' | sudo su -c 'echo "${testUserName}:${testUserPassword}" | chpasswd'`;
        await system.exec(setPasswordCmd);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1878601-连续输入5次错误密码', async ({ device, agent, uos, system, env }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 确保在桌面环境
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

        // 步骤1: 进入锁屏界面（模拟登录界面）
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });

        // 步骤2: 连续输入5次错误密码，观察从密码错误到账户锁定的过程
        let locked = false;
        for (let i = 1; i <= 5; i++) {
            await device.typeAscii('wrongpwd');
            await device.pressKey('Enter');
            // 使用 aiAsyncAssert 捕捉短暂的密码错误提示（启动时刻约 1000/1500/2000/2500ms）
            try {
                await agent.aiAsyncAssert('界面显示密码错误或验证失败的提示信息', {
                    startCount: 4,
                    intervalMs: 500,
                    initialDelayMs: 1000,
                });
            } catch (e) {
                // 可能是账户已锁定，不再显示密码错误提示
            }
            // 检查是否已锁定
            locked = await agent.aiBoolean('界面显示"请X分钟后再试"或"请稍后再试"的锁定提示');
            if (locked) {
                break;
            }
        }

        // 预期: 账户被锁定，显示锁定倒计时提示
        await agent.aiAssert('界面显示请稍后再试或X分钟后再试的锁定提示');

        // 步骤3: 等待1分钟，验证锁定提示仍然显示（倒计时持续运行中）
        await new Promise(resolve => setTimeout(resolve, 60000));
        await agent.aiAssert('界面仍显示请X分钟后再试的锁定提示，账户仍处于锁定状态');

        // 步骤4: 使用系统命令强制解锁回到桌面
        await system.exec(`echo '${passWord}' | sudo faillog --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally2 --reset --user uos 2>/dev/null || true`);
        await system.exec('loginctl unlock-sessions 2>/dev/null || true');
        await system.exec('killall dde-lock 2>/dev/null || true');
        await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 步骤5: 验证已回到桌面
        await uos.showDesktop();
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
        await agent.aiAssert('已回到桌面，账户锁定状态已通过系统命令解除');
    }, { timeout: 600000, tags: ['1878601', 'level3', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        // 重置PAM失败计数器并重启认证服务
        await system.exec(`echo '${passWord}' | sudo faillog --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally --reset --user uos 2>/dev/null || true`);
        await system.exec(`echo '${passWord}' | sudo pam_tally2 --reset --user uos 2>/dev/null || true`);
        await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName} 2>/dev/null || true`;
        await system.exec(deleteUserCmd);
    });
});
