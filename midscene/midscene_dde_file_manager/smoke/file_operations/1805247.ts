/**
 * 用例 PMSID: 1805247
 * 用例标题: 排序 - 名称排序，字母排序，多字母
 * 生成时间: 2025-12-17 12:00:00
 * 用例编写人: UT002411
 */

describe('1805247-排序 - 名称排序，字母排序，多字母', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：准备测试文件
    const randomSuffix = Math.floor(Math.random() * 100000);
    const testDir = `~/Desktop/1805247te_${randomSuffix}`;
    await system.exec(`mkdir -p ${testDir}`);
    await system.exec(`bash -c 'cd ${testDir} && touch {a..z}.txt {A..Z}.txt'`)
    console.log('3. beforeEach: 测试文件创建完成');
  });

  test('1805247-排序 - 名称排序，字母排序，多字母', async ({ device, agent, uos, KeyCode }) => {
    // 步骤 1: 进入桌面测试文件夹，排序默认升序
    await agent.aiDoubleClick('1805247te开头的文件夹');
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("放大镜搜索图标的左侧插件的左数第二个图标", { deepThink: true });
    await agent.aiAssert("文件排序默认升序，a和A在前，z和Z在后");
    console.log('4. 字母升序测试通过');
    // 步骤 2: 点击名称，切换排序为降序
    await agent.aiTap("名称");
    await agent.aiAssert("文件排序为降序，z和Z在前，a和A在后");
    console.log('5. 字母降序测试通过');

  }, { timeout: 600000,
       tags: ['1805247', 'level2', 'smoke', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('6. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('7. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec(`rm -rf ~/Desktop/1805247*`);
  });
});
