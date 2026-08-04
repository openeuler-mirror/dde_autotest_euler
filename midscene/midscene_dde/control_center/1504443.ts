/**
 * 用例 PMSID: 1504443
 * 用例标题:【控制中心】【账户】【删除账户】唯一的管理员账户不允许删除
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504443-【控制中心】【账户】【删除账户】唯一的管理员账户不允许删除', () => {
    const testUserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 新建标准用户test2
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const test2Name = 'test2';
        await system.exec(`echo '${passWord}' | sudo useradd -m ${test2Name} -s /usr/bin/bash`);
        await system.exec(`echo '${passWord}' | sudo su -c 'echo "${test2Name}:${testUserPassword}" | chpasswd'`);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504443-唯一的管理员账户不允许删除', async ({ device, agent, uos, env, system }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        
        // 步骤1: 打开控制中心-账户
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 30000 });
        await agent.aiTap('账户');

        // 查看当前管理员账户的删除按钮状态（当系统存在唯一管理员时）
        const UserName = env.testUserName || process.env.TEST_USERNAME || 'uos';
        await agent.aiTap(`${UserName}账户`);
        await agent.aiAssert('删除当前账户按钮置灰');

        // 新建test3管理员账户，检查删除按钮状态是否可用
        const test3Name = 'test3';
        await system.exec(`echo '${passWord}' | sudo useradd -m ${test3Name} -s /usr/bin/bash`);
        await system.exec(`echo '${passWord}' | sudo su -c 'echo "${test3Name}:${testUserPassword}" | chpasswd'`);
        await system.exec(`echo '${passWord}' | sudo usermod -aG sudo ${test3Name}`);
        await agent.aiTap('test3账户');
        await agent.aiAssert('删除当前账户按钮红色字体显示，没有灰化');

        // 验证标准用户可以删除
        await agent.aiTap('左侧账户菜单');
        await agent.aiWaitFor('显示其他账户', { timeoutMs: 30000 });
        await agent.aiTap('test2账户');
        await agent.aiAssert('删除当前账户按钮红色字体显示，没有灰化');
        await uos.closeCurrentWindow();

    }, { timeout: 300000, tags: ['1504443', 'level1', 'smoke', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const testUsers = ['test2', 'test3'];
        // 清理：删除测试用户
        for (const userName of testUsers) {
            const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${userName} 2>/dev/null || true`;
            await system.exec(deleteUserCmd);
        }
        await uos.closeCurrentWindow();
    });
});