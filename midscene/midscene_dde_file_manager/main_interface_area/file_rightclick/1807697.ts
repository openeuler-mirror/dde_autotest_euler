/**
 * 用例 PMSID: 1807697
 * 用例标题: 检查root用户文管-列表模式-留白处右键菜单
 * 生成时间: 2026-07-07 10:00:00
 * 用例编写人： UT000649（黄甜）
 */

describe('1807697-检查root用户文管-列表模式-留白处右键菜单', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await system.exec('killall dde-file-manager', 500);
    });

    test('1807697-检查root用户文管-列表模式-留白处右键菜单', async ({ device, agent, uos, system, env }) => {
        console.log('=== 开始测试：1807697 ===');
        const TEST_PASSWORD = process.env.TEST_PASSWORD;
        await uos.openApp('文件管理器', 3000, 20000, true);
        await uos.maximizeWindow();
        await agent.aiTap('文件管理器侧边栏的系统盘');
        await agent.aiRightClick('系统盘目录空白处');
        await agent.aiTap('以管理员身份打开');
        await agent.aiWaitFor('以管理员身份打开需要认证弹窗');
        await agent.aiTap('以管理员身份打开');
        await agent.aiInput( `${TEST_PASSWORD}`,'密码输入框');
        await agent.aiTap('以管理员身份打开需要认证弹窗的确定');
        await agent.aiWaitFor('桌面无以管理员身份打开需要认证弹窗');

        await agent.aiTap('右上角有3条横线的图标');
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiTap('视图');
        await agent.aiTap('默认视图右侧的下拉箭头');
        await agent.aiTap('列表视图');
        await agent.aiTap('设置窗口右上角的关闭按钮:x');

        console.log('步骤1：最近使用目录，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的最近使用');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤2：主目录，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的主目录');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤3：一般目录，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的文档目录');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤4：回收站，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的回收站');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤5：系统盘目录，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的系统盘');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤6：数据盘目录，文件留白处右键');
        await agent.aiTap('文件管理器侧边栏的数据盘');
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        console.log('步骤7：各目录对应搜索结果目录，文件留白处右键');
        await agent.aiTap('文件管理器菜单栏的搜索框');
        await device.typeText('test');
        await device.pressKey('enter')
        await agent.aiRightClick('文件管理器窗口空白处');
        await agent.aiAssert('显示右键菜单');

        await agent.aiTap('文件管理器窗口右上角关闭按钮:X');

        console.log('✅ 1807697用例测试完成');
    }, { timeout: 1200000, tags: ["1807697", 'level3', 'file_rightclick', 'DITT', 'huangtian'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await agent.aiTap('右上角有3条横线的图标');
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiTap('视图');
        await agent.aiTap('默认视图右侧的下拉箭头');
        await agent.aiTap('图标视图');
        await agent.aiTap('设置窗口右上角的关闭按钮:x');
        await agent.aiTap('文件管理器窗口右上角关闭按钮:X');        
        await system.exec('killall dde-file-manager', 500);
        await uos.closeCurrentWindow();
    });
});