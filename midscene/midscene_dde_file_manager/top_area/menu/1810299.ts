/**
 * 用例 PMSID: 1810299
 * 用例标题:  不勾选【显示隐藏文件】-弹窗功能检查
 * 生成时间: 2026-01-30 10:00:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810299-不勾选【显示隐藏文件】-弹窗功能检查', () => {
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
    await system.exec('rm -rf ~/Desktop/.181029*', 500);
    await system.exec('rm -rf ~/Desktop/181029*', 500);
    await system.exec('rm -rf ~/Desktop/新建文本*', 500);
  });

  test('1810299-不勾选【显示隐藏文件】-弹窗功能检查', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810299-不勾选【显示隐藏文件】-弹窗功能检查 ===');

    //前置条件：创建测试文件和文件夹
    await system.exec('touch ~/Desktop/1810299.txt', 500);
    await system.exec('mkdir ~/Desktop/1810299', 500);

    //步骤1: 	在文管普通目录内以“.”开头批量重命名文件/文件夹，弹窗后点击【取消】,文件名恢复成修改之前名称
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    await agent.aiTap("文件管理器左侧的桌面");
    //以“.”开头重命名文件
    await agent.aiRightClick("1810299.txt");
    await agent.aiTap("重命名");
    await device.typeText('.1810299', false);
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("取消");
    //文件名恢复成修改之前名称
    await agent.aiAssert("桌面显示1810299.txt");
    //以“.”开头重命名文件夹
    await agent.aiRightClick("1810299");
    await agent.aiTap("重命名");
    await device.typeText('.1810299', false);
    await device.pressKey("Enter");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("取消");
    //文件夹名恢复成修改之前名称
    await agent.aiAssert("桌面显示1810299文件夹");

    //步骤2:再次在文管普通目录内以“.”开头重命名文件/文件夹,弹出【隐藏文件提示弹窗】
    await agent.aiRightClick("1810299.txt");
    await agent.aiTap("重命名");
    await device.typeText('.1810299_1', false);
    await device.pressKey("Enter");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");

    //步骤3:在文管窗口普通目录内以“.”开头新建文件，弹窗后点击右上角【X】,文件名恢复成修改之前名称
    await agent.aiRightClick("空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.1810299_2');
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右上角【X】");
    //文件夹名恢复成修改之前名称
    await agent.aiAssert("桌面显示1810299.txt");

    console.log('✅ 1810299用例测试完成');


  }, { timeout: 600000, tags: ["1810299", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/.181029*', 500);
    await system.exec('rm -rf ~/Desktop/181029*', 500);
    await system.exec('rm -f ~/Desktop/新建文本*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.
    
    
    
    
    
    
    
    pressKey('Esc');
    await uos.showDesktop();
  });
});








