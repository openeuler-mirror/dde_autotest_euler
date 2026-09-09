/**
 * 用例 PMSID: 1804899
 * 用例标题: 不勾选【显示隐藏文件】-在桌面以“.”开头批量重命名文件-弹窗提示-点击【隐藏】
 * 生成时间: 2026-03-03 17:20:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804899-不勾选【显示隐藏文件】-在桌面以“.”开头批量重命名文件-弹窗提示-点击【隐藏】', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件夹和文件
    await system.exec('rm -rf ~/Desktop/1804899*', 500);
    await system.exec('rm -rf ~/Desktop/.1804899*', 500);
  });

  test('1804899-不勾选【显示隐藏文件】-在桌面以“.”开头批量重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1804899-不勾选【显示隐藏文件】-在桌面以“.”开头批量重命名文件-弹窗提示-点击【隐藏】 ===');

    //前置条件：桌面创建测试文件夹和测试文件
     await system.exec('mkdir -p ~/Desktop/1804899 && touch ~/Desktop/1804899/1804899.txt ~/Desktop/1804899/1804899_1.txt ~/Desktop/1804899/1804899_2.txt', 500);

    //步骤1: 在桌面以“.”开头批量重命名文件/文件夹
    await agent.aiRightClick("1804899");
    await agent.aiTap("打开");
    await device.pressKey("Ctrl+A");
    await agent.aiRightClick("1804899.txt");
    await agent.aiTap("重命名");
    await agent.aiTap("替换文本");
    await agent.aiTap("自定义文本");
    await device.typeText('.1804899');
    await agent.aiTap("右上角的重命名");
    //预期：弹出【隐藏文件提示弹窗】
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");

    //步骤2: 弹窗后点击【隐藏】
    await agent.aiTap("隐藏");
    //预期：重命名文件/文件夹成功，文件/文件夹被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("主区域未显示文件");

    //步骤3: 再次在桌面以“.”开头重命名文件/文件夹
    await uos.showDesktop();
    await agent.aiRightClick("1804899");
    await agent.aiTap("重命名");
    await device.typeText('.1804899');
    await agent.aiTap("桌面空白处");
    //预期：弹出【隐藏文件提示弹窗】
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    await agent.aiTap("隐藏");
    await agent.aiAssert("桌面不显示1804899文件夹");

    console.log('✅ 1804899用例测试完成');

  }, { timeout: 600000, tags: ["1804899", "level2", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理可能存在的测试文件夹和文件
    await system.exec('rm -rf ~/Desktop/1804899*', 500);
    await system.exec('rm -rf ~/Desktop/.1804899*', 500);
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







