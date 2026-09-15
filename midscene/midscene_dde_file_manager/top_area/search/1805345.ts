/**
 * 用例 PMSID: 1805345
 * 用例标题: 【搜索】全文搜索md-输入混合语言匹配单个md
 * 生成时间: 2026-03-05 19:50:05
 * 用例编写人: UT000193（郑豪）
 */

describe('1805345-【搜索】全文搜索md-输入混合语言匹配单个md', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：准备测试文件，内容包含所有搜索字符
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v false');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('echo "天 ss123空s44下雨lllll 呼龍4s呼 mm22" >> ~/Desktop/1805345.md');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v true');
  });

  test('1805345-【搜索】全文搜索md-输入混合语言匹配单个md', async ({ device, agent, uos, system }) => {
    // 等待五分钟更新索引
    console.log('开始等待5分钟')
    await new Promise(resolve => setTimeout(resolve, 300000));
    console.log('等待5分钟完成')

    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");

    // 步骤1：输入"天"进行搜索
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('天');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言1：匹配到有"天"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤2：输入"ss"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('ss');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言2：匹配到有"ss"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤3：输入"44"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('44');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言3：匹配到包含"44"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤4：输入"ss123"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('ss123');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言4：匹配到有"ss"、"123"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤5：输入"呼龍4"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('呼龍4');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言5：匹配到有"呼龍"、"4"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤6：输入"s呼"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('s呼');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言6：匹配到有"s"、"呼"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

    // 步骤7：输入"天ss123空s44下雨lllll  呼龍4s呼      mm22"进行搜索
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('天 ss123空s44下雨lllll 呼龍4s呼 mm22');
    await agent.aiWaitFor("搜索结果加载完毕");
    // 断言7：匹配到有"天"、"ss"、"123"、"空"、"s"、"44"、"下雨"......."mm"、"22"的文件
    await agent.aiAssert("搜索结果中包含'1805345.md'文件");

  }, { timeout: 1200000, tags: ['1805345', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm ~/Desktop/1805345.md');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
