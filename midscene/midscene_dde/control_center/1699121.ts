/**
 * 用例 PMSID: 1699121
 * 用例标题:【控制中心】【隐私和安全】隐私和安全二级菜单项界面展示
 * 生成时间: 2026-04-29
 * 用例编写人: UT002485(卢燕)
 */

describe('1699121-【控制中心】【隐私和安全】隐私和安全二级菜单项界面展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1699121-【控制中心】【隐私和安全】隐私和安全二级菜单项界面展示', async ({ device, agent, uos, env }) => {
        // 打开控制中心-隐私和安全菜单界面
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('窗口左侧的隐私和安全');

        // 左侧列表焦点显示
        await agent.aiAssert('左侧列表上，隐私和安全有蓝底选中显示');

        // 右侧窗口导航栏显示
        await agent.aiAssert('右侧窗口左上角显示：< 隐私和安全');
        await agent.aiAssert('窗口右上角显示：菜单图标、最小化按钮、还原按钮、关闭按钮');

        // 摄像头菜单项检查
        await agent.aiTap('摄像头');
        await agent.aiAssert('总是允许下面的应用访问您的摄像头');
        await agent.aiAssert('显示内容有：安全中心、备份还原、磁盘管理器、打印管理器、服务与支持、截图录屏等');

        // 办公云盘的摄像头使能/去使能设置
        await agent.aiTap('办公云盘右侧显示蓝色使能按钮');
        const isInitialized = await agent.aiBoolean('显示修改系统级权限需要认证');
        if (isInitialized) {
            await device.typeText(env.testPassword);
            await agent.aiTap('确认按钮');
        } else {
            await agent.aiWaitFor('去使能按钮');
        }
        await agent.aiAssert('办公云盘右侧显示灰色去使能按钮');
        await agent.aiTap('办公云盘右侧显示灰色去使能按钮');

        // 文件和文件夹菜单项检查
        await agent.aiTap('窗口顶部的隐私和安全');
        await agent.aiTap('文件和文件夹');
        await agent.aiAssert('允许下面的应用访问您的文件和文件夹');
        await agent.aiAssert('显示内容有：安全中心、备份还原、磁盘管理器、打印管理器、服务与支持、截图录屏等');
        await agent.aiAssert('右侧显示v');

        // 安全中心的文件夹使能/去使能设置
        await agent.aiTap('安全中心右侧按钮v');
        await agent.aiWaitFor('"文档"文件夹');
        await agent.aiTap('"文档"文件夹右侧蓝色使能按钮');
        const isInitialized2 = await agent.aiBoolean('显示修改系统级权限需要认证');
        if (isInitialized2) {
            await device.typeText(env.testPassword);
            await agent.aiTap('确认按钮');
        } else {
            await agent.aiWaitFor('"文档"文件夹右侧显示灰色去使能按钮');
        }
        await agent.aiAssert('"文档"文件夹右侧显示灰色去使能按钮');
        await agent.aiTap('"文档"文件夹右侧灰色去使能按钮');

    }, { timeout: 300000, tags: ['1699121','level1','smoke'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await agent.aiTap('窗口左侧的隐私和安全');
        await device.pressKey('alt', 'F4');
    });
});
