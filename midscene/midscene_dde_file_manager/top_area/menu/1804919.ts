/**
 * 用例 PMSID: 1804919
 * 用例标题:  不勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-弹窗提示-点击右上角【X】
 * 生成时间: 2026-01-30 10:00:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804919-不勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-弹窗提示-点击右上角【X】', () => {
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

  beforeEach(async ({ device, uos, agent, system }) => {
    // 清理可能存在的测试文件
    await system.exec('rm -f ~/Desktop/.test_1804919.txt', 500);
    await system.exec('rm -f ~/Desktop/新建文本.txt', 500);
    await system.exec('rm -rf ~/Desktop/新建文件夹', 500);
  });

  test('1804919-不勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-弹窗提示-点击右上角【X】', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1804919-不勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-弹窗提示-点击右上角【X】 ===');


    //步骤1: 	在文管窗口普通目录内以“.”开头新建文件，弹窗后点击右上角【X】
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiRightClick("空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.test_1804919', false);
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");
    //文件名恢复成修改之前名称
    await agent.aiAssert("桌面显示新建文本.txt,不显示.test_1804919.txt");

    //步骤2:在文管窗口普通目录内以“.”开头新建文件夹，弹窗后点击右上角【X】
    await agent.aiRightClick("桌面空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('.test_1804919');
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");
    //文件夹名恢复成修改之前名称
    await agent.aiAssert("桌面显示新建文件夹");

    //步骤3:在文管窗口普通目录内以“.”开头重命名文件，弹窗后点击右上角【X】
    await agent.aiRightClick("文本文档");
    await agent.aiTap("重命名");
    await device.typeText('.test_1804919_1');
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");
    //文件夹名恢复成修改之前名称
    await agent.aiAssert("桌面显示新建文本.txt,不显示.test_1804919_1.txt");

    //步骤4:在文管窗口普通目录内以“.”开头重命名文件，弹窗后点击右上角【X】
    await agent.aiRightClick("新建文件夹");
    await agent.aiTap("重命名");
    await device.typeText('.test_1804919_1');
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");
    //文件夹名恢复成修改之前名称
    await agent.aiAssert("桌面显示新建文件夹");

    console.log('✅ 1804919用例测试完成');


  }, { timeout: 600000, tags: ["1804919", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理可能存在的测试文件和文件夹
    await system.exec('rm -f ~/Desktop/.test_1804919.txt', 500);
    await system.exec('rm -f ~/Desktop/新建文本.txt', 500);
    await system.exec('rm -rf ~/Desktop/新建文件夹', 500);
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








