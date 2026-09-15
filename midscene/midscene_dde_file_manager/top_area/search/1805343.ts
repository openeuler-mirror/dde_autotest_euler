
/**
 * 用例 PMSID: 1805343
 * 用例标题: 【搜索】全文搜索-搜索md加密文件
 * 生成时间: 2026-02-07 16:02:29
 * 用例编写人: UT000193（郑豪）
 */

describe('1805343-【搜索】全文搜索-搜索md加密文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件
    await system.exec('wget -P ~/Desktop URL http://10.20.63.143/zl-test/TestDate/openssl_file');
  });

  test('1805343-【搜索】全文搜索-搜索md加密文件', async ({ device, agent, uos }) => {
    // 步骤1： 输入匹配内容'加密'关键字搜索加密文件
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.typeText('加密');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言1：	搜索结果中没有搜索到对应文件openssl_file
    await agent.aiAssert("搜索结果中没有显示openssl_file.md文件");
    
  }, { timeout: 600000, tags: ['1805343', 'level4', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm -f ~/Desktop/openssl_file');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
