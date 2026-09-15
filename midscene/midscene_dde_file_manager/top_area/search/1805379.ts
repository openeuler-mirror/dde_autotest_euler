 
/**
 * 用例 PMSID: 1805379
 * 用例标题: 【搜索】全文搜索-特殊符号进行搜索
 * 生成时间: 2026-03-05 19:44:32
 * 用例编写人: UT000193（郑豪）
 */

describe('1805379-【搜索】全文搜索-特殊符号进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：准备测试文件，内容包含"天 ss 呼 mm22 m m"
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v false');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('echo "天 ss 呼 mm22 m m" >> ~/Desktop/1805379.txt');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v ture');
  });

  test('1805379-【搜索】全文搜索-特殊符号进行搜索', async ({ device, agent, uos, system }) => {
    // 等待五分钟更新索引
    console.log('开始等待5分钟')
    await new Promise(resolve => setTimeout(resolve, 300000));
    console.log('等待5分钟完成')

    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");

    // 步骤1：输入“天 ss”
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('天 ss');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言1：可正确搜索文件中有天的和文件中有ss的
    await agent.aiAssert("搜索结果中包含'1805379.txt'文件");

    // 步骤2：输入“呼 mm22”
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('呼 mm22');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言2：可正确搜索文件中有呼的，文件中有mm22的，文件中有mm的，文件中有22的
    await agent.aiAssert("搜索结果中包含'1805379.txt'文件");

    // 步骤3：输入 m m搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('m m');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言3：可以搜索到有m的文件
    await agent.aiAssert("搜索结果中包含'1805379.txt'文件");

  }, { timeout: 1200000, tags: ['1805379', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm ~/Desktop/1805379.txt');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
  });
});
