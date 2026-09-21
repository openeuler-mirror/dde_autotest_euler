/**
 * 用例 PMSID: 1808913
 * 用例标题: 【支持视图模式应用到所有目录】- 进入本地目录A，修改当前目录为非默认后(列表视图)，恢复默认视图
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808913-【支持视图模式应用到所有目录】- 进入本地目录A，修改当前目录为非默认后(列表视图)，恢复默认视图', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808913-【支持视图模式应用到所有目录】- 进入本地目录A，修改当前目录为非默认后(列表视图)，恢复默认视图', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");
    
    // 步骤2：创建多个层级的目录文件
    await system.exec("mkdir -p ~/Music/1808913_1/1808913_2/1808913_3 && touch ~/Music/1808913_1/1808913_2/1808913_3/1808913.txt");
    
    // 步骤3：在音乐目录修改为列表视图
    await agent.aiTap("左侧导航栏音乐目录");
    // await agent.aiDoubleClick('1808913_1文件夹');
    await agent.aiAssert('1808913_1文件夹可见');
    await agent.aiTap('地址栏右侧第二个列表视图按钮');
    await agent.aiAssert('1808913_1以列表视图展示');
    
    // // 步骤4：检查显示方式为列表视图
    // await agent.aiRightClick("左侧导航栏音乐目录的空白区域");
    // await agent.aiHover("显示方式");
    // await agent.aiAssert("列表视图被勾选");
    // await agent.aiTap("左侧导航栏音乐目录的空白区域");
    
    // 步骤5：修改默认视图为图标视图，恢复到默认视图
    await agent.aiTap("文件管理器右上角设置按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("视图选项");
    await agent.aiTap("默认视图右侧的图标视图");
    await agent.aiTap('图标视图');
    await agent.aiTap("恢复默认视图按钮");
    await agent.aiTap("设置页面右上角关闭按钮");
    
    // 步骤6：在音乐目录空白处鼠标右键检查显示方式，显示方式为图标视图
    await agent.aiRightClick("音乐目录的右侧空白区域");
    await agent.aiHover("显示方式");
    await agent.aiAssert("图标视图被勾选");
    await agent.aiTap("音乐目录的右侧空白区域");

    // 步骤7：前进、后退检查1808913_1文件夹的视图
    await agent.aiDoubleClick('1808913_1文件夹');
    await agent.aiAssert('1808913_2以图标视图展示');
    await agent.aiDoubleClick('1808913_2文件夹');
    await agent.aiAssert('1808913_3以图标视图展示');
    await agent.aiDoubleClick('1808913_3文件夹');
    await agent.aiAssert('1808913.txt以图标视图展示');
    await agent.aiTap('地址栏1808913_1');
    await agent.aiAssert('1808913_2以图标视图展示');
    
  }, { timeout: 1800000, tags: ["1808913", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 恢复文件管理器设置
    await system.cleanupFileManager();

    // 清除创建的文件
    await system.exec('rm -rf ~/Music/1808913*');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
