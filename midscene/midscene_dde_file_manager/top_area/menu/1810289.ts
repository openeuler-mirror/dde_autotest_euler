/**
 * 用例 PMSID: 1810289
 * 用例标题:  不勾选【显示隐藏文件】-弹窗提示文案
 * 生成时间: 2026-02-03 14:20:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810289-不勾选【显示隐藏文件】-弹窗提示文案', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/.test181089*', 500);
  });

  test('1810289-不勾选【显示隐藏文件】-弹窗提示文案', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810289-不勾选【显示隐藏文件】-弹窗提示文案 ===');

    //步骤1: 在文件保存对话框/文件选择对话框内以“.”开头新建文件夹，弹窗后点击【隐藏】
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiRightClick("空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.test1810289');
    await agent.aiTap("桌面空白处");
    console.log('✅ 已输入文件名称: .test1810289.txt');
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");

    //步骤2:弹窗文案、按钮选项及默认设置检查
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    await agent.aiTap("隐藏");
   
    console.log('✅ 1810291用例测试完成');

  }, { timeout: 600000, tags: ["1810289", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件夹
    await system.exec('rm -rf ~/Desktop/.test1810289*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});







