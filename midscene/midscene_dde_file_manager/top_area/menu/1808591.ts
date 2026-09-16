
/**
 * 用例 PMSID: 1808591
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-打开
 * 生成时间: 2026-02-02 16:18:00
 * 用例编写人: UT001774(李炎)
 */



describe('1808591-【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-打开', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理可能存在的测试文件
        await system.exec('rm -f ~/Desktop/test_file*', 500);
    });

    test('1808591-【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-打开', async ({ device, agent, uos, env, system }) => {
        console.log('=== 开始测试：打开文件设置项默认值验证 ===');

        //前置条件：创建测试文件
        await system.exec('touch ~/Desktop/test_file.txt', 500);

        // 步骤1: 文管右上角菜单设置窗口-基础设置-打开行为，设置项："打开文件"，默认值：双击
        console.log('操作1: 打开文件管理器');
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiAssert("文件管理器窗口已打开");
        console.log('✅ 文件管理器已打开');
        // 打开设置菜单
        console.log('操作2: 打开设置菜单');
        await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
        await agent.aiTap("下拉菜单中的设置", { deepThink: true });
        console.log('✅ 设置窗口已打开');
        // 定位到基础设置-打开行为
        console.log('操作3: 定位到基础设置-打开行为');
        await agent.aiTap("基础设置", { deepThink: true });
        await agent.aiAssert("当前窗口显示基础设置选项");
        console.log('✅ 已进入基础设置页面');
        // 验证打开文件设置项默认值
        console.log('操作4: 验证打开文件设置项默认值');
        await agent.aiAssert("打开文件选项存在");
        await agent.aiAssert("打开文件右侧显示默认值：双击");
        console.log('✅ 打开文件设置项默认值验证通过：双击');


        //步骤2: 下拉菜单选择"单击"后，在文管中单击文件，文件被打开
        console.log('操作1: 展开打开文件下拉菜单');
        await agent.aiTap("打开文件的下拉框", { deepThink: true });
        await agent.aiAssert("下拉菜单展开，显示单击和双击选项");
        console.log('✅ 下拉菜单已展开');
        // 选择单击选项
        console.log('操作2: 选择单击选项');
        await agent.aiTap("下拉菜单中的单击", { deepThink: true });
        await agent.aiAssert("打开文件设置显示为单击");
        console.log('✅ 打开文件设置已更改为单击');
        // 关闭设置窗口
        console.log('操作3: 关闭设置窗口');
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        // 在文管中单击文件验证功能
        console.log('操作4: 在文管中单击文件验证功能');
        await agent.aiTap("文件管理器左侧导航栏的桌面");
        await agent.aiTap("test_file.txt");
        await agent.aiAssert("文件被打开");
        console.log('✅ 单击文件后文件被成功打开');
        // 关闭打开的文件
        console.log('操作5: 关闭打开的文件');
        await agent.aiTap("文件窗口关闭按钮", { deepThink: true });
        console.log('✅ 文件已关闭');


        //步骤3: 下拉菜单选择"双击"后，在文管中双击文件，文件被打开
        console.log('步骤1: 打开文件管理器');
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiAssert("文件管理器窗口已打开");
        console.log('✅ 文件管理器已打开');
        // 打开设置菜单
        console.log('步骤2: 打开设置菜单');
        await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
        await agent.aiTap("下拉菜单中的设置", { deepThink: true });
        console.log('✅ 设置窗口已打开');
        // 定位到基础设置-打开行为
        console.log('步骤3: 定位到基础设置-打开行为');
        await agent.aiTap("基础设置", { deepThink: true });
        await agent.aiAssert("当前窗口显示基础设置选项");
        await agent.aiTap("打开行为", { deepThink: true });
        console.log('✅ 已进入打开行为页面');
        // 展开打开文件下拉菜单
        console.log('步骤4: 展开打开文件下拉菜单');
        await agent.aiWaitFor('定位到打开文件');
        await agent.aiTap("打开文件的下拉框");
        await agent.aiAssert("下拉菜单展开，显示单击和双击选项");
        console.log('✅ 下拉菜单已展开');
        // 选择双击选项
        console.log('步骤5: 选择双击选项');
        await agent.aiTap("下拉菜单中的双击", { deepThink: true });
        await agent.aiAssert("打开文件设置显示为双击");
        console.log('✅ 打开文件设置已更改为双击');
        // 关闭设置窗口
        console.log('步骤6: 关闭设置窗口');
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        // 在文管中双击文件验证功能
        console.log('步骤7: 在文管中双击文件验证功能');
        await agent.aiTap("文件管理器左侧导航栏的桌面");
        await agent.aiDoubleClick("test_file.txt");
        await agent.aiAssert("文件被打开");
        console.log('✅ 双击文件后文件被成功打开');
        //关闭打开的文件
        console.log('步骤8: 关闭打开的文件');
        await agent.aiTap("文件窗口关闭按钮", { deepThink: true });
        console.log('✅ 文件已关闭');

        console.log('✅ 1808591用例执行成功');

    }, { timeout: 600000, tags: ["1808591", "level3", "menu", "liyan"] });


    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await system.cleanupFileManager();
        // 清理可能存在的测试文件
        await system.exec('rm -f ~/Desktop/test_file*', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});