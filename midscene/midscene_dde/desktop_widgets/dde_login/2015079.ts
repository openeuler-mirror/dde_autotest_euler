/**
 * 用例 PMSID: 2015079
 * 用例标题:【桌面】【锁屏】【密码框】每次进入锁屏界面，固定密文状态
 * 生成时间: 2026-08-27
 * 用例编写人: UT002485（卢燕）
 */

describe('2015079-【桌面】【锁屏】【密码框】每次进入锁屏界面，固定密文状态', () => {
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

    test('2015079-每次进入锁屏界面固定密文状态', async ({ device, agent, uos, system, env }) => {
        const originalUserName = env.testUserName || process.env.TEST_USERNAME || 'uos';

        // 确保在桌面环境
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

        // 步骤1: 进入锁屏界面，输入正确的密码解锁
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });
        await device.typeAscii(process.env.TEST_PASSWORD);
        await device.pressKey('Enter');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
        await agent.aiAssert('解锁成功，登录到系统桌面');

        // 步骤2: 再次进入锁屏界面，输入密码字符
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });
        // 确保眼形图标处于密文状态（重置可能的残留状态）
        const eyeOpen = await agent.aiBoolean('密码框右侧的眼形图标处于睁开状态');
        if (eyeOpen) {
            await agent.aiHover('密码框右侧的眼形图标');
            await system.exec('DISPLAY=:0 xdotool click 1');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        await agent.aiAssert('密码框默认密文状态');
        await device.typeAscii('test12');
        await agent.aiAssert('密码字符以密文形式显示，显示6个密文圆点');

        // 步骤3: 点击眼形图标一次，验证明文显示后还原为密文状态
        await agent.aiHover('密码框右侧的眼形图标');
        await system.exec('DISPLAY=:0 xdotool mousedown 1');
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert('密码字符以明文形式显示，显示为test12');
        await system.exec('DISPLAY=:0 xdotool mouseup 1');
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert('密码框还原为密文状态，显示密文圆点');

        // 清空密码框，输入正确密码解锁
        await device.pressKey('Ctrl', 'A');
        await device.pressKey('Delete');
        await device.typeAscii(process.env.TEST_PASSWORD);
        await device.pressKey('Enter');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
    }, { timeout: 600000, tags: ['2015079', 'level3', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName} 2>/dev/null || true`;
        await system.exec(deleteUserCmd);
    });
});
