/**
 * 用例 PMSID: 1805095
 * 用例标题: 文管历史导航，检查多层级目录路径_
 * 生成时间: 2026-02-06 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805095-文管历史导航，检查多层级目录路径_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1805095-文管历史导航，检查多层级目录路径_', async ({ device, agent, uos, system, env }) => {
    // 步骤1：桌面新建多个层级的文件夹
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Desktop/1805095/1805095_1/1805095_2/1805095_3`);

    // 步骤2：双击桌面文件夹，打开文管窗口，路径定位到该文件夹
    await uos.showDesktop();
    await agent.aiDoubleClick('桌面上的1805095文件夹');
    await agent.aiWaitFor('文件管理器窗口打开');
    await agent.aiAssert('地址栏路径显示桌面/1805095');
    
    // 步骤3：访问该文件夹内部的多个层级目录，检查顶部历史导航的路径是否正确
    // 进入第一层级目录
    await agent.aiDoubleClick('1805095_1');
    await agent.aiAssert('地址栏路径显示桌面/1805095/1805095_1');
    
    // 进入第二层级目录
    await agent.aiDoubleClick('1805095_2');
    await agent.aiAssert('地址栏路径显示桌面/1805095/1805095_1/1805095_2');
    
    // 进入第三层级目录
    await agent.aiDoubleClick('1805095_3');
    await agent.aiAssert('地址栏路径显示桌面/1805095/1805095_1/1805095_2/1805095_3');
    
    // 返回上一级目录，检查历史导航
    await agent.aiTap('1805095_1');
    await agent.aiAssert('地址栏路径显示桌面/1805095/1805095_1');
    
  }, { timeout: 1800000, tags: ["1805095", "level2", "history_navigation", "liqingling"] });
  
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
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/1805095*`);
  });
});
