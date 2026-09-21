/**
 * 用例 PMSID: 1808753
 * 用例标题: 树状结构-关闭树状结构
 * 生成时间: 2026-01-05 15:08:47
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808753-树状结构-关闭树状结构', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808753-树状结构-关闭树状结构', async ({ device, agent, uos, system }) => {
    const directories = [ '桌面', '视频', '图片', '音乐', '文档'];
    
    // 步骤1：随机选择一个目录
    const randomDir = directories[Math.floor(Math.random() * directories.length)];
    console.log(`随机选择目录: ${randomDir}`);
    
    // 步骤2：打开文件管理器
    await uos.openApp('文件管理器');

    // 步骤3：文件管理器设置中修改默认视图为树状视图
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("视图选项");
    await agent.aiTap("默认视图下拉菜单");
    await agent.aiTap('树状视图');
    await agent.aiTap('恢复默认视图');
    await agent.aiTap("设置页面右上角关闭按钮");
    
    // 步骤4：进入随机选择的目录
    await agent.aiTap(`左侧导航栏${randomDir}目录`);
    
    // 步骤5：点击右侧标题栏的"图标视图"小图标
    await agent.aiTap('文件管理器右上角第二行的第一个图标');
    await agent.aiAssert('文件管理器右上角第二行的第一个图标高亮显示', 2000);
    
    // 步骤6：重新随机选择另一个目录
    const newRandomDir = directories.filter(dir => dir !== randomDir)[Math.floor(Math.random() * (directories.length - 1))];
    console.log(`重新随机选择目录: ${newRandomDir}`);
    
    // 步骤7：进入新选择的目录
    await agent.aiTap(`左侧导航栏${newRandomDir}目录`);
    
    // 步骤8：点击右侧标题栏的"列表视图"小图标
    await agent.aiTap('文件管理器右上角第二行的第二个图标');
    await agent.aiAssert('文件管理器右上角第二行的第二个图标高亮显示');
    
  }, { timeout: 1800000, tags: ["1808753", "level2", "view", "liqingling"] });
  
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
