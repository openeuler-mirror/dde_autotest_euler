/**
 * 用例 PMSID: 1805685
 * 用例标题: 【回收站】入口-通过启动器进入回收站
 * 生成时间：2025-12-11 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805685-【回收站】入口-通过启动器进入回收站', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805685-【回收站】入口-通过启动器进入回收站', async ({ device, agent, uos, system}) => {
    // 步骤 1: 打开启动器 // 启动系统应用启动器
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp("回收站");
    await agent.aiWaitFor("回收站已打开");
    await agent.aiAssert("左侧侧边栏高亮定位在回收站");
    

  }, { timeout: 120000, tags: ['1805685','level1', 'smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});
