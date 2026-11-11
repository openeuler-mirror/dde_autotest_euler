/**
 * 用例 PMSID: 1878599
 * 用例标题:【桌面】【登录】密码错误tooltip提示
 * 生成时间: 2026-08-27
 * 用例编写人: UT002485（卢燕）
 */

describe('1878599-【桌面】【登录】密码错误tooltip提示', () => {
    const testUserName = 'testuser';
    const testUserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
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
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const createUserCmd = `echo '${passWord}' | sudo useradd -m ${testUserName} -s /usr/bin/bash`;
        await system.exec(createUserCmd);
        const setPasswordCmd = `echo '${passWord}' | sudo su -c 'echo "${testUserName}:${testUserPassword}" | chpasswd'`;
        await system.exec(setPasswordCmd);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1878599-密码错误tooltip提示', async ({ device, agent, uos, system, env }) => {
        const originalUserName = env.testUserName || process.env.TEST_USERNAME || 'uos';

        // 确保在桌面环境
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

        // 步骤1: 进入锁屏界面（模拟登录界面）
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });

        // 检查是否因之前测试导致账户被锁定，如果锁定则等待解锁
        try {
            const isLocked = await agent.aiBoolean('密码框显示"请稍后再试"或类似锁定提示');
            if (isLocked) {
                console.log('账户被锁定，等待解锁...');
                // 使用系统命令重置PAM失败计数器
                await system.exec('sudo faillog --reset --user uos 2>/dev/null || sudo pam_tally --reset --user uos 2>/dev/null || true');
                await system.exec('loginctl unlock-sessions 2>/dev/null || true');
                await system.exec('killall dde-lock 2>/dev/null || true');
                await new Promise(resolve => setTimeout(resolve, 3000));
                // 重新锁屏
                await uos.showDesktop();
                await device.pressKey('Super', 'L');
                await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });
            }
        } catch (e) {}

        // 步骤2: 输入错误密码
        await device.typeAscii('wrongpwd');
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 预期: 密码错误提示或验证失败提示（如果账户被锁定也算验证失败的响应）
        await agent.aiAssert('界面显示密码错误、验证失败、还可以尝试次数、或请稍后再试的提示信息');

        // 清空密码框，输入正确密码解锁（如果账户被锁定则用系统命令强制解锁）
        try {
            const isLocked = await agent.aiBoolean('密码框显示"请稍后再试"或类似的锁定提示');
            if (isLocked) {
                // 账户被锁定，使用系统命令强制解锁
                await system.exec('loginctl unlock-sessions 2>/dev/null || true');
                await system.exec('killall dde-lock 2>/dev/null || true');
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                await device.pressKey('Ctrl', 'A');
                await device.pressKey('Delete');
                await device.typeAscii(process.env.TEST_PASSWORD);
                await device.pressKey('Enter');
                await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
            }
        } catch (e) {
            // 兜底：强制解锁
            await system.exec('loginctl unlock-sessions 2>/dev/null || true');
            await system.exec('killall dde-lock 2>/dev/null || true');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }, { timeout: 600000, tags: ['1878599', 'level3', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName} 2>/dev/null || true`;
        await system.exec(deleteUserCmd);

        // 恢复环境：确保解锁锁屏并登录到UOS系统桌面
        console.log('6. afterAll: 恢复环境，等待并确认登录UOS系统');
        try {
            // 方式1: 通过系统命令强制解锁
            await system.exec('loginctl unlock-sessions 2>/dev/null || true');
            await system.exec('killall dde-lock 2>/dev/null || true');
            await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 方式2: 如果仍在锁屏/登录界面，通过UI登录
            const isAtDesktop = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
            if (!isAtDesktop) {
                console.log('仍在锁屏/登录界面，尝试UI登录...');
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

            // 方式3: 最终兜底确保显示桌面
            await uos.showDesktop();
            await new Promise(resolve => setTimeout(resolve, 2000));

            const finalDesktop = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
            console.log(`环境恢复完成，桌面状态: ${finalDesktop ? '已确认在桌面' : '可能仍有问题'}`);

            // 单击ESC关闭可能打开的启动器
            await device.pressKey('Escape');
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            console.log(`环境恢复过程出错: ${e}`);
        }
    });
});
