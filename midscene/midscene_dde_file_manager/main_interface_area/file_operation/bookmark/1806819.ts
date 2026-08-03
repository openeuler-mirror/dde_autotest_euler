
/**
 * 用例 PMSID: 1806819
 * 用例标题: 快捷访问-删除快捷访问文件夹
 * 生成时间: 2025-12-25 20:00:54
 * 用例编写人: UT000193（郑豪）
 */

describe('1806819-快捷访问-删除快捷访问文件夹', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('rm -rf ~/1806819');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/1806819');
  });

  test('1806819-快捷访问-删除快捷访问文件夹', async ({ device, agent, uos, system }) => {
    // 前置：添加到快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('文件管理器侧边栏的主目录');
    await agent.aiWaitFor('主目录页面加载完成');
    await agent.aiRightClick("'1806819'文件夹图标");
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 步骤1：删除快捷访问源文件夹-查看快捷访问展示
    // 断言1：快捷访问还存在
    await system.exec('rm -rf ~/1806819');
    await agent.aiAssert('文件管理器侧边栏的存在1806819文件夹');

    // 步骤2：点击快捷访问
    // 断言2：无连接，删除提示
    await agent.aiTap('文件管理器侧边栏的1806819文件夹');
    await agent.aiAssert('屏幕中间弹窗提示”抱歉，找不到您的快捷访问目录，是否移除?“');

    // 步骤3：点击移除
    // 断言3：正常删除快捷访问
    await agent.aiTap('弹出中的移除');
    await agent.aiAssert('文件管理器侧边栏的不存在1806819文件夹');
  }, { timeout: 600000, tags: ['1806819', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
