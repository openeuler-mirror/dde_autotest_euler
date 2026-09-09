/**
 * 用例 PMSID: 1804865
 * 用例标题: 设置-“打开行为”
 * 生成时间: 2026-2-25 13:20:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804865-设置-“打开行为”', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        //处理可能存在的弹框和右键菜单
        await device.pressKey('Esc');
        //关闭所有文管窗口
        await system.exec('killall dde-file-manager', 500);
        //显示桌面
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        //前置条件：创建测试文件
        await system.exec('touch ~/Desktop/1804865.txt', 500);
    });

    test('1804865-设置-“打开行为”', async ({ device, agent, uos, env }) => {
        console.log('=== 开始测试：1804865-设置-“打开行为” ===');

        // 步骤1:进入设置恢复默认设置--总是在新窗口打开文件夹（未勾选）
        //打开文件管理器并验证初始状态
        console.log('步骤1-1: 打开文件管理器，验证初始状态');
        await uos.openApp("文件管理器", 3000, 20000, true);
        console.log('✅ 文件管理器已打开');
        // 打开设置菜单
        console.log('步骤1-2: 打开设置菜单');
        await agent.aiTap("右上角设置");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        // 验证"总是在新窗口打开文件夹"选项初始状态（未勾选）
        console.log('步骤1-4: 验证选项初始状态');
        await agent.aiAssert("总是在新窗口打开文件夹文字左侧没有蓝色√");
        // 关闭设置窗口
        console.log('步骤1-5: 关闭设置窗口');
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        //在文件管理器打开一个文件，不会新打开一个窗口
        await agent.aiTap("文件管理器左侧的主目录");
        await agent.aiDoubleClick("主区域中的桌面文件夹");
        await agent.aiAssert("当前窗口进入文件夹内部，没有打开新窗口");

        // 步骤2: “总是在新窗口打开文件夹”--勾选
        await agent.aiTap("右上角设置");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        console.log('步骤2-1: 勾选"总是在新窗口打开文件夹"选项');
        await agent.aiTap("总是在新窗口打开文件夹文字左侧方框的中心");
        await agent.aiAssert("总是在新窗口打开文件夹文字左侧有蓝色√");
        console.log('✅ 选项已勾选');
        //在文件管理器打开一个文件，会新打开一个窗口
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        console.log('步骤2-2: 验证勾选后的行为 - 在新窗口打开文件夹');
        await agent.aiTap("文件管理器左侧的主目录");
        await agent.aiDoubleClick("主区域中的桌面文件夹");
        await agent.aiAssert("弹出新窗口显示桌面主界面");
        console.log('✅ 文件夹在新窗口中打开');
        // 关闭新窗口，回到原窗口
        console.log('步骤2-3: 关闭新窗口，回到原窗口');
        await agent.aiTap("当前窗口关闭按钮:x");

        // 步骤3: “打开方式”：“双击”
        console.log('步骤3-1: 重新打开设置菜单');
        await agent.aiTap("右上角设置", { deepThink: true });
        await agent.aiTap("下拉菜单中的设置", { deepThink: true });
        // 验证打开文件设置项默认值
        console.log('操作3-2: 验证打开文件设置项默认值');
        await agent.aiAssert("打开文件右侧显示默认值：双击");
        console.log('✅ 打开文件设置项默认值验证通过：双击');
        //在文件管理器，选择一个文件，双击文件，文件被打开
        console.log('步骤3-3: 关闭设置窗口');
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        // 在文管中双击文件验证功能
        console.log('步骤3-4: 在文管中双击文件验证功能');
        await agent.aiTap("文件管理器左侧导航栏的桌面");
        await agent.aiDoubleClick("1804865.txt");
        await agent.aiAssert("文件被打开");
        console.log('✅ 双击文件后文件被成功打开');
        //关闭打开的文件
        console.log('步骤3-5: 关闭打开的文件');
        await agent.aiTap("文件窗口关闭按钮", { deepThink: true });
        console.log('✅ 文件已关闭');

        // 步骤4: “打开方式”：“单击”
        await agent.aiTap("右上角设置");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("打开文件的下拉框", { deepThink: true });
        console.log('✅ 下拉菜单已展开');
        // 选择单击选项
        console.log('操作4-1: 选择单击选项');
        await agent.aiTap("下拉菜单中的单击", { deepThink: true });
        await agent.aiAssert("打开文件设置显示为单击");
        console.log('✅ 打开文件设置已更改为单击');
        // 关闭设置窗口
        console.log('操作4-2: 关闭设置窗口');
        await agent.aiTap("当前窗口关闭按钮:x");
        console.log('✅ 设置窗口已关闭');
        // 在文管中单击文件验证功能
        console.log('操作4-3: 在文管中单击文件验证功能');
        await agent.aiTap("文件管理器左侧导航栏的桌面");
        await agent.aiTap("1804865.txt");
        await agent.aiAssert("文件被打开");
        console.log('✅ 单击文件后文件被成功打开');
        // 关闭打开的文件
        console.log('操作4-4: 关闭打开的文件');
        await agent.aiTap("文件窗口关闭按钮", { deepThink: true });
        console.log('✅ 文件已关闭');

        console.log('✅ 1804865用例测试完成');

    }, { timeout: 600000, tags: ["1804865", "level3", "menu", "liyan"] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await system.cleanupFileManager();
        await system.exec('rm -f ~/Desktop/1804865.txt', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});