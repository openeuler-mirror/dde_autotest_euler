/**
 * 用例 PMSID: 1810445
 * 用例标题: 视图-默认视图模式
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1810445-视图-默认视图模式', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1810445-视图-默认视图模式', async ({ device, agent, uos, system }) => {
    // 步骤1：点击导航栏左侧主目录、桌面、视频、音乐、图片、文档中的任意一个目录，最近使用和下载目录默认使用列表视图
    await uos.openApp("文件管理器");

    const directories = ["主目录", "桌面", "视频", "音乐", "图片", "文档"];
    const randomDir = directories[Math.floor(Math.random() * directories.length)];
    await agent.aiTap(`左侧导航栏${randomDir}`);
    
    // 步骤2：在空白区域鼠标右键，悬浮在显示方式，验证图标视图默认被选中
    await agent.aiRightClick(`${randomDir}目录右侧空白区域`);
    await agent.aiHover("显示方式");
    await agent.aiAssert("图标视图被勾选");
    
    // 步骤3：点击右上角设置按钮，选择设置
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置选项");
    
    // 步骤4：检查设置页面的视图，默认视图为图标视图
    await agent.aiTap("视图选项");
    await agent.aiAssert('默认视图对应选项为图标视图');
    
    // 步骤5：关闭设置页面
    await agent.aiTap("设置页面右上角关闭按钮");
    
  }, { timeout: 1800000, tags: ["1810445", "level4", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
