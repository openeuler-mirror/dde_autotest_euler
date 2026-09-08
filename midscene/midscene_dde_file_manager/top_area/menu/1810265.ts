/**
 * 用例 PMSID: 1810265
 * 用例标题:  勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-3-10 14:10:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810265-勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示', () => {
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
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/1810265*', 500);
    await system.exec('rm -rf ~/Videos/.01* ~/Videos/.181* ~/Desktop/.01* ', 500);
    await system.exec('rm -rf ~/Videos/新建*', 500);
    await system.exec('rm -rf ~/Desktop/.181*', 500);
  });

  test('1810265-勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810265-勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示 ===');

    //前置条件：创建测试文件和文件夹
    await system.exec('mkdir -p ~/Desktop/1810265', 500);
    await system.exec('touch ~/Desktop/1810265.txt', 500);
    // 显示隐藏文件
    await device.pressKey('Ctrl+H');

    //步骤1：在文件选择对话框内以“.”开头新建文件
    await uos.openApp('文本编辑器', { maximizeWindow: true });
    console.log('文本编辑器已启动');
    await agent.aiTap('文本编辑器右上角的菜单按钮');
    await agent.aiWaitFor('打开文件选项');
    await agent.aiTap('打开文件');
    await agent.aiTap('文件管理器左侧的视频');
    await agent.aiRightClick("文件管理器窗口的空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.01n');
    await device.pressKey("Enter");
    //预期：无弹窗提示，新建文件成功
    await agent.aiAssert("主区域中显示.01n.txt文件");

    //步骤2：在文件选择对话框内以“.”开头新建文件夹
    await agent.aiRightClick("文件管理器窗口的空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('.1810265');
    await device.pressKey("Enter");
    //预期：无弹窗提示，新建文件夹成功
    await agent.aiAssert("主区域中显示.1810265文件夹");

    //步骤3：在文件选择对话框内以“.”开头重命名文件
    await agent.aiTap('文件管理器左侧的桌面');
    await agent.aiRightClick("1810265.txt上方的文件图标");
    await agent.aiTap("重命名");
    await device.typeText('.011');
    await device.pressKey("Enter");
    //预期：无弹窗提示，重命名成功
    await agent.aiAssert("主区域中显示.011.txt文件");

    //步骤4：在文件选择对话框内以“.”开头重命名文件夹
    await agent.aiRightClick("1810265上方的文件夹图标");
    await agent.aiTap("重命名");
    await device.typeText('.181n');
    await device.pressKey("Enter");
    //预期：无弹窗提示，重命名成功
    await agent.aiAssert("主区域中显示.181n文件夹");

    await device.pressKey('Ctrl+H');// 取消勾选显示隐藏文件,还原环境
    console.log('✅ 1810265用例测试完成');

  }, { timeout: 600000, tags: ["1810265", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/1810265*', 500);
    await system.exec('rm -rf ~/Videos/.01* ~/Videos/.181* ~/Desktop/.01* ', 500);
    await system.exec('rm -rf ~/Desktop/.181*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 关闭所有文本编辑器窗口
    await system.exec('killall deepin-editor', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});







