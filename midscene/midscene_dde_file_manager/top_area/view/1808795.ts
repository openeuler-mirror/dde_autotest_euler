/**
 * 用例 PMSID: 1808795
 * 用例标题: 树状结构-重启文管不记录展开或折叠状态
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808795-树状结构-重启文管不记录展开或折叠状态', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808795-树状结构-重启文管不记录展开或折叠状态', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");
    
    // 步骤2：文件管理器视图设置为树状视图
    await agent.aiTap("文件管理器右上角设置按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("视图选项");
    await agent.aiTap('默认视图下拉框');
    await agent.aiTap('树形视图');
    await agent.aiTap("恢复默认视图");
    await agent.aiTap("设置页面右上角关闭按钮"); 

    // 步骤3：创建多个层级的目录文件
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/1808795_1/1808795_2/1808795_3/ && touch ~/Documents/1808795_1/1808795_2/1808795_3/1808795.txt`);

    // 步骤5：进入测试文件目录，展开测试目录
    await agent.aiTap("导航栏左侧文档目录");
    await agent.aiHover('1808795_1');
    await agent.aiTap('1808795_1前面展开的按钮', 500);
    await agent.aiAssert('1808795_2文件夹可见');
    await agent.aiTap('1808795_2前面展开的按钮', 500);
    await agent.aiAssert('1808795_3文件夹可见');
    await agent.aiTap('1808795_3前面展开的按钮', 500);
    await agent.aiAssert('1808795.txt文件可见');

    // 步骤6：重启文管后进入测试目录，没有记录之前折叠或者展开的状态
    await system.exec('killall dde-file-manager');
    await uos.openApp("文件管理器");
    await agent.aiTap('导航栏左侧文档目录');
    await agent.aiAssert('1808795_1文件夹可见，1808795_1文件夹前面的箭头指向向右');
    
  }, { timeout: 1800000, tags: ["1808795", "level3", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关键清理操作 - 必须执行，不受前面操作失败影响
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1808795*`);

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
