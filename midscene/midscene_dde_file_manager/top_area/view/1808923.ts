/**
 * 用例 PMSID: 1808923
 * 用例标题:【支持视图模式应用到所有目录】- 恢复默认视图，多标签同步
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808923-【支持视图模式应用到所有目录】- 恢复默认视图，多标签同步', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808923-【支持视图模式应用到所有目录】- 恢复默认视图，多标签同步', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器，并添加一个页签
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap('文件管理器顶部+按钮');
    await system.exec("sleep 2");

    // 步骤2：在第一个页签中，点击左侧导航栏桌面
    await agent.aiTap('在计算机目录的右侧，标签栏中的第一个标签页');
    await system.exec("sleep 3");
    await agent.aiTap("左侧导航栏桌面目录");
    
    // 步骤3：在第一个页签空白处鼠标右键，悬浮在显示方式，验证列表视图被勾选
    await agent.aiRightClick("桌面目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiTap('列表视图');
    await system.exec("sleep 3");
    await agent.aiRightClick("桌面目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiAssert("列表视图被勾选");
    await system.exec("sleep 3");
    await device.pressKey('ESC');
    await device.pressKey('ESC');
    
    // 步骤4：在第二个页签中，点击左侧导航栏文档目录
    await agent.aiHover('在文件管理器的右侧，顶部标签栏左起第二个标签页');
    await agent.aiTap('在文件管理器的右侧，标签页为计算机');
    await agent.aiAssert('左侧导航栏计算机目录被选中');
    await agent.aiTap("左侧导航栏文档目录");
    await system.exec("sleep 3");
    
    // 步骤5：在第二个页签空白处鼠标右键，悬浮在显示方式，验证树形视图默认被勾选
    await agent.aiRightClick("文档目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiTap('树形视图');
    await system.exec("sleep 3");
    await agent.aiRightClick("文档目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiAssert('树形视图被勾选');
    await system.exec("sleep 3");
    
    // 步骤6：重新打开一个文件管理器设置中修改默认视图为图标视图
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("文件管理器右上角的设置按钮");
    await agent.aiTap("设置");
    await agent.aiTap("视图选项");
    await agent.aiTap("默认视图右侧的图标视图");
    await agent.aiTap('图标视图');
    await system.exec("sleep 3");
    await agent.aiTap('所有目录恢复默认视图后面的恢复默认视图按钮');
    await agent.aiTap("设置页面右上角关闭按钮");
    // await agent.aiTap('文件管理器右上角的关闭按钮');

    // 步骤7：检查第二个页签中文档目录视图为图标视图
    await agent.aiTap('文件管理器右侧顶部标签栏文档标签页');
    await agent.aiRightClick("文档目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiAssert('图标视图被勾选');
    await system.exec("sleep 3");

    // 步骤8：检查第一个页签中桌面目录视图为图标视图
    await agent.aiTap('文件管理器右侧顶部标签栏桌面标签页');
    await agent.aiRightClick("桌面目录右侧中间空白区域");
    await agent.aiHover("显示方式");
    await agent.aiAssert('图标视图被勾选');
    
  }, { timeout: 1800000, tags: ["1808923", "level4", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
