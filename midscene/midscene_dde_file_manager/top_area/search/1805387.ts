/**
 * 用例 PMSID: 1805387
 * 用例标题: 【搜索】全文搜索-繁体、数字单独/混合进行搜索
 * 生成时间: 2026-02-06 19:39:52
 * 用例编写人: UT000193（郑豪）
 */

describe('1805387-【搜索】全文搜索-繁体、数字单独/混合进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：准备测试文件，内容"龍2認2風測試1234 77"
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v false');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('echo "龍s認s風測試1234 77" >> ~/Desktop/1805387.txt');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v ture');
  });

  test('1805387-【搜索】全文搜索-繁体、数字单独/混合进行搜索', async ({ device, agent, uos, system }) => {
    // 等待五分钟更新索引
    console.log('开始等待5分钟')
    await new Promise(resolve => setTimeout(resolve, 300000));
    console.log('开始等待5分钟')

    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");

    // 步骤1：输入"龍"字进行搜索
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('龍');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言1：可搜索到正确的结果
    await agent.aiAssert("搜索结果中包含'1805387.txt'文件",);

    // 步骤2：输入"風測試"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('風測試');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言2：可搜索到正确的结果
    await agent.aiAssert("搜索结果中包含'1805387.txt'文件");

    // 步骤3：输入"風測試1234"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('風測試1234');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言3：可搜索到正确的结果
    await agent.aiAssert("搜索结果中包含'1805387.txt'文件");

    // 步骤4：输入"77"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('77');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言4：可搜索到正确的结果
    await agent.aiAssert("搜索结果中包含'1805387.txt'文件");

  }, { timeout: 1200000, tags: ['1805387', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm ~/Desktop/1805387.txt');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
