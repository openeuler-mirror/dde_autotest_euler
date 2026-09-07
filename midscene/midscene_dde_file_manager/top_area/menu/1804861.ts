/**
 * 用例 PMSID: 1804861
 * 用例标题: [190]设置-默认基础设置
 * 生成时间: 2026-04-27
 * 用例编写人: UT000649（黄甜）
 */

describe('1804861-[190]设置-默认基础设置', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await system.exec('killall dde-file-manager', 500);
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1804861-[190]设置-默认基础设置', async ({ device, agent, uos, env }) => {
        console.log('=== 开始测试：1804861-设置-默认基础设置 ===');

        // 步骤1: 打开文件管理器，进入设置，选择"恢复默认设置"
        console.log('步骤1: 打开文件管理器并进入设置');
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiWaitFor("文件管理器界面已显示");
        console.log('✅ 文件管理器已打开');
        
        // 打开设置菜单并恢复默认设置
        console.log('步骤1-2: 打开设置并恢复默认设置');
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        
        // 恢复默认设置(需要滚动到页面底部)
        await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
        await agent.aiTap("文件粉碎");
        await agent.aiTap("恢复默认");
        console.log('✅ 已恢复默认设置');
        
        // 步骤2: 查看"打开行为"默认设置
        console.log('步骤2: 验证"打开行为"默认设置');
        await agent.aiScroll('左侧设置菜单栏', { direction: 'up', distance: 10 });
        await agent.aiTap("打开行为");
            
        // 验证打开行为默认值
        await agent.aiAssert("总是在新窗口打开文件夹文字左侧没有蓝色√（未勾选）");
        await agent.aiAssert("打开文件右侧显示默认值：双击");
        console.log('✅ "打开行为"默认设置验证通过');
        
        // 步骤3: 查看"新窗口和新标签"默认设置
        console.log('步骤3: 验证"新窗口和新标签"默认设置');
        await agent.aiTap("新窗口");
        await agent.aiAssert("默认目录右侧显示默认值：计算机");

        await agent.aiTap("新标签");
        await agent.aiAssert("从新标签打开右侧显示默认值：当前目录");
        console.log('✅ "新窗口和新标签"默认设置验证通过');
        
        // 步骤4: 查看"隐藏文件"默认设置
        console.log('步骤5: 验证"隐藏文件"默认设置');
        await agent.aiTap("文件和目录");
        await agent.aiAssert("显示隐藏文件左侧没有蓝色√（未勾选）");
        await agent.aiAssert("显示文件扩展名左侧有蓝色√（已勾选）");
        console.log('✅ "隐藏文件"默认设置验证通过');
        
        console.log('✅ 1804861用例测试完成');

    }, { timeout: 600000, tags: ["1804861", "level3", "menu", "DITT","huangtian"] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await system.cleanupFileManager();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});
