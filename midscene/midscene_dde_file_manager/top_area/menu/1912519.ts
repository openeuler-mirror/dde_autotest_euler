/**
 * 用例 PMSID: 1912519
 * 用例标题: 管理员模式-菜单-主题
 * 生成时间: 2026-03-09 09:36:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1912519-管理员模式-菜单-主题', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1912519-管理员模式-菜单-主题', async ({ device, agent, uos, system, env }) => {
    // 步骤1：打开文件管理器-桌面，在空白处鼠标右键，以管理员身份打开，弹出授权校验框，输入密码，点击确定
    await uos.openApp('文件管理器');
    await agent.aiTap("左侧导航栏桌面目录");
    await agent.aiRightClick("桌面目录右侧中间空白区域", 500);
    await agent.aiTap("以管理员身份打开");
    await agent.aiAssert('授权校验框已弹出');
    await agent.aiTap('密码输入框');
    await device.typeText(env.testPassword);
    await agent.aiTap("确定按钮", 2000);
    await agent.aiAssert('标签栏顶部显示Desktop');

    // 步骤3：检查右上角的菜单按钮-主题，主题默认为"跟随系统"
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiHover("主题");
    await agent.aiAssert('跟随系统被勾选');
    await agent.aiTap('文件管理器空白处');

    // 步骤4：切换为深色主题，查看文件管理器显示，软件界面底色会显示成黑色
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("主题", 500);
    await agent.aiTap("深色", 500);
    await agent.aiAssert('文件管理器界面底色显示为深色主题风格');

    // 步骤5：查看文件管理器每个目录下和对话框主题风格，为深色主题
    await agent.aiTap("左侧导航栏计算机目录");
    await agent.aiAssert('计算机目录界面为深色主题风格');
    await agent.aiTap("左侧导航栏主目录");
    await agent.aiAssert('主目录界面为深色主题风格');
    
    // 步骤6：设置页面验证主题
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置");
    await agent.aiAssert('设置界面正常打开');
    await agent.aiAssert('设置界面为深色主题风格');
    await agent.aiTap("设置页面右上角关闭按钮");

    // 步骤7：关闭设置界面后，修改浅色和跟随系统，页面均正常显示无异常
    // 测试浅色主题
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("主题", 500);
    await agent.aiTap("浅色", 500);
    await agent.aiAssert('文件管理器界面底色显示为浅色主题风格');

    // 测试跟随系统主题
    await agent.aiTap('文件管理器空白处');
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("主题", 500);
    await agent.aiTap("跟随系统", 1000);
    await agent.aiTap('文件管理器空白处');
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiHover('主题');
    await agent.aiAssert('跟随系统已勾选');
    await agent.aiTap('文件管理器空白处');
    await agent.aiTap('文件管理器右上角关闭按钮');
    
  }, { timeout: 1800000, tags: ["1912519", "level3", "menu", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
    await system.exec(`echo ${env.testPassword} | sudo killall dde-file-manager`);
    
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
