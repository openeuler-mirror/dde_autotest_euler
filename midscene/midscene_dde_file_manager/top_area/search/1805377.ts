
/**
 * 用例 PMSID: 1805377
 * 用例标题: 【搜索】搜索-特殊路径搜索
 * 生成时间: 2026-02-06 20:46:41
 * 用例编写人: UT000193（郑豪）
 */

describe('1805377-【搜索】搜索-特殊路径搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805377-【搜索】搜索-特殊路径搜索', async ({ device, agent, uos }) => {
    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    
    // 步骤1：在搜索框中输入：search:?url=file:///home/hailin/Demo&keyword=%23
    await device.pressKey('Ctrl+L');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('search:?url=file:///home/hailin/Demo&keyword=%23');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 断言1：会直接到Demo搜索#，出现结果
    await agent.aiAssert("文件管理器顶部显示Demo目录中的搜索结果，右上角搜索栏显示一个#");
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤2：在搜索框中输入：search:?url=recent:///&keyword=1
    await device.pressKey('Ctrl+L');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('search:?url=recent:///&keyword=1');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 断言2：会直接搜索最近使用目录中“1”的关键词
    await agent.aiAssert("文件管理器右上角搜索栏显示一个'1'");
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("左侧栏主目录");
    await agent.aiWaitFor("主目录加载完成");
    
    // 步骤3：在搜索框中输入：recent:///
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('recent:///');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Backspace');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 断言3：进入到最近使用目录中
    await agent.aiAssert("文件管理器进入最近使用目录界面");
    
    // 步骤4：在搜索框中输入：trash:///
    await device.pressKey('Ctrl+L');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('trash:///');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 断言4：进入到回收站目录中
    await agent.aiAssert("文件管理器进入回收站目录界面");
    
  }, { timeout: 600000, tags: ['1805377', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
