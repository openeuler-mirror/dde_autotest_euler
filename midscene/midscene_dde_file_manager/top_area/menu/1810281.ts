/**
 * 用例 PMSID: 1810281
 * 用例标题: 不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示
 * 生成时间: 2026-02-03 17:20:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810281-不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -r ~/Desktop/新建文件夹*', 500);
    await system.exec('rm -rf ~/Desktop/新建文本*', 500);
    await system.exec('rm -rf ~/Desktop/.1810281*', 500);
  });

  test('1810281-不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810281-不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示 ===');


    //步骤1: 在桌面以“.”开头新建文件,	弹出【隐藏文件提示弹窗】
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiRightClick("空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.1810281');
    await agent.aiTap("桌面空白处");
    console.log('✅ 已输入文件夹名称: .1810281');
    //步骤2: 弹窗文案、按钮选项及默认设置检查
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    //关闭弹框，方便下一步操作
    await agent.aiTap("弹窗右上角【X】"); 

    //步骤3: 在桌面以“.”开头新建文件夹,	弹出【隐藏文件提示弹窗】
    await agent.aiRightClick("空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('.1810281');
    await agent.aiTap("桌面空白处");
    console.log('✅ 已输入文件夹名称: .1810281');
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    //关闭弹框，方便下一步操作
    await agent.aiTap("弹窗右上角【X】");

    //步骤4:在桌面以“.”开头重命名文件，弹出【隐藏文件提示弹窗】
    await agent.aiRightClick("新建文本.txt");
    await agent.aiTap("重命名");
    await device.typeText('.1810281_1');
    await device.pressKey("Enter");
    console.log('✅ 已输入文件夹名称: .1810281_1');
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    //关闭弹框，方便下一步操作
    await agent.aiTap("弹窗右上角【X】");

    //步骤5: 在桌面以“.”开头重命名文件夹，弹出【隐藏文件提示弹窗】
    await agent.aiRightClick("新建文件夹");
    await agent.aiTap("重命名");
    await device.typeText('.1810281_002');
    await agent.aiTap("桌面空白处");
    console.log('✅ 已输入文件夹名称: .1810281_002');
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiAssert("弹窗中的选项有：【隐藏】【取消】");
    await agent.aiTap("弹窗右上角【X】");

    console.log('✅ 1810281用例测试完成');

  }, { timeout: 600000, tags: ["1810281", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理可能存在的测试文件
    await system.exec('rm -r ~/Desktop/新建文件夹*', 500);
    await system.exec('rm -rf ~/Desktop/新建文本*', 500);
    await system.exec('rm -rf ~/Desktop/.1810281*', 500);
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







