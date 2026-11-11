/**
 * 用例 PMSID: 1848663
 * 用例标题:【桌面】【登录】登录界面logo显示
 * 生成时间: 2026-08-27
 * 用例编写人: UT002485（卢燕）
 */

describe('1848663-【桌面】【登录】登录界面logo显示', () => {
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

    test('1848663-登录界面logo显示', async ({ device, agent, uos, system, env }) => {
        const originalUserName = env.testUserName || process.env.TEST_USERNAME || 'uos';

        // 确保在桌面环境
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

        // 步骤1: 进入锁屏界面（模拟登录界面）
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });
        await agent.aiAssert('锁屏界面正常显示');

        // 步骤2: 查看锁屏界面左下角显示uos的logo和版本号
        await agent.aiAssert('锁屏界面左下角显示版本标识，包含"专业版"文字');
        await agent.aiAssert('锁屏界面左下角显示版本号');

        // 获取系统版本号进行对比
        const versionResult = await system.exec('cat /etc/deepin-version | grep Version');
        const versionStr = versionResult.stdout.trim();
        await agent.aiAssert(`锁屏界面左下角显示版本信息，系统版本为${versionStr}`);

        // 解锁回到桌面
        await device.typeAscii(process.env.TEST_PASSWORD);
        await device.pressKey('Enter');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
    }, { timeout: 600000, tags: ['1848663', 'level3', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName} 2>/dev/null || true`;
        await system.exec(deleteUserCmd);
    });
});
