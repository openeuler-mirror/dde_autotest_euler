/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1806467
 * 用例标题: 文件操作-打开原件已被删除的.txt文件快捷方式图标_
 * 生成时间: 2026-3-26
 * 用例编写人: UT001774(李炎)
 */

describe('1806467-文件操作-打开原件已被删除的.txt文件快捷方式图标_', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        // 关闭所有文本编辑器窗口
        await system.exec('killall deepin-editor', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理可能存在的测试文件和快捷方式
        await system.exec('rm -rf ~/Desktop/1806467* ~/Videos/1806467*', 500);
    });

    test('1806467-文件操作-打开原件已被删除的.txt文件快捷方式图标_', async ({ device, agent, uos, system }) => {


        //前置条件：创建测试文件
        await system.exec('touch ~/Videos/1806467.txt', 500);

        // 步骤 1: 在文管中选中任意txt右键发送到桌面
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的视频");
        await agent.aiRightClick("1806467.txt正上方的图标");
        await agent.aiWaitFor("右键菜单显示");
        await agent.aiHover("发送到");
        await agent.aiTap("发送到桌面");
        // 预期： 桌面上出现该txt的快捷方式
        await uos.showDesktop();
        await agent.aiWaitFor("显示桌面");
        await agent.aiAssert("桌面存在以18064开头快捷方式.txt结尾的文件");

        // 步骤 2: 删除源txt文件
        await system.exec('rm -rf ~/Videos/1806467.txt', 500);
        // 预期：删除成功
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的视频");
        await agent.aiAssert("主区域不显示1806467.txt文件");

        // 步骤 3: 桌面的文本文档快捷方式，单击右键 - 打开方式 - 文本编辑器
        await uos.showDesktop();
        await agent.aiDoubleClick("快捷方式.txt结尾的文件");
        // 预期：弹出提示"此快捷方式指向的xxx.txt已被更改或移动，是否删除此快捷方式?"
        await agent.aiAssert("此快捷方式所指向的“快捷方式.txt”已被更改或移动");

        // 步骤 4: 弹窗中单击"确定"
        await agent.aiTap("弹框中的确定");
        // 预期：快捷方式被删除
        await agent.aiAssert("桌面不显示以18064开头快捷方式.txt结尾的文件");

        console.log("=== 1806467-文件操作-打开原件已被删除的.txt文件快捷方式图标_,执行成功 ===");

    }, { timeout: 600000, tags: ["1806467", "level3", "mouse_keyboard_operations", "liyan"] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理可能存在的测试文件和快捷方式
        await system.exec('rm -rf ~/Desktop/1806467* ~/Videos/1806467*', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.cleanupFileManager();
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        // 关闭所有文本编辑器窗口
        await system.exec('killall deepin-editor', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});









