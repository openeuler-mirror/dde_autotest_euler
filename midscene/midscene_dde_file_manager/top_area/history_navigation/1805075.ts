/**
 * 用例 PMSID: 1805075
 * 用例标题: [t]历史导航-浏览记录多个窗口不影响
 * 生成时间: 2026-02-06 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805075-[t]历史导航-浏览记录多个窗口不影响', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1805075-[t]历史导航-浏览记录多个窗口不影响', async ({ device, agent, uos, system, env }) => {
    // 步骤1：桌面文件夹下存在多个目录
    await system.exec(`mkdir -p ~/Desktop/1805075/{1805075_1,1805075_2,1805075_3}`);
    await system.exec(`mkdir -p ~/Documents/1805075_test/{1805075_test_1,1805075_test_2,1805075_test_3}`);


    // 步骤2：打开文件管理器进入“主目录”-“桌面”-“1805075”，查看浏览路径
    await uos.openApp("文件管理器");
    await agent.aiTap('左侧导航栏主目录');
    await agent.aiDoubleClick('主目录右侧的桌面文件夹');
    await agent.aiDoubleClick('1805075');
    await agent.aiAssert('地址栏路径显示桌面/1805075');
    
    // 步骤3：关闭文件管理器之后再次打开，新的文件管理器中的浏览路径默认为“计算机”
    await system.exec('killall dde-file-manager');
    
    // 重新打开文件管理器,左侧边栏“计算机”选中高亮
    await uos.openApp("文件管理器");
    await agent.aiAssert('左侧导航栏计算机选中，高亮显示');
    
    // 步骤4：打开多个文件管理器，分别进入不同的目录或相同目录
    await uos.openApp("文件管理器");
    await agent.aiWaitFor('第二个文件管理器窗口');
    
    // 在第二个窗口中导航到桌面/其他文件夹
    await agent.aiTap('左侧导航栏主目录');
    await agent.aiDoubleClick('主目录右侧的文档文件夹');
    await agent.aiDoubleClick('1805075_test');
    await agent.aiAssert('地址栏路径显示文档/1805075_test');
    
  }, { timeout: 1800000, tags: ["1805075", "level4", "history_navigation", "liqingling"] });
  
  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
    
    // 清理测试目录
    await system.exec(`rm -rf ~/Desktop/1805075*`);
    await system.exec(`rm -rf ~/Documents/1805075_test*`);
  });
});
