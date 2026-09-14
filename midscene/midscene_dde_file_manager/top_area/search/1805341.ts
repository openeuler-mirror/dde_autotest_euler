
/**
 * 用例 PMSID: 1805341
 * 用例标题: 搜索-anything进程合并
 * 生成时间: 2026-01-13 10:17:25
 * 用例编写人: UT000193（郑豪）
 */

describe('1805341-搜索-anything进程合并', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805341-搜索-anything进程合并', async ({ device, agent, uos, system }) => {
    // 步骤1：系统启动后，使用：ps -elf | grep deepin-anything 查看anything进程信息
    const anythingResult = await system.exec('ps -elf | grep deepin-anything');

    // 断言1：系统中没有：deepin-anything-tool --dbus
    await agent.aiAssert(`${anythingResult}输出中不存在/usr/bin/deepin-anything-monitor`);

    // 断言2：系统中没有：/usr/bin/deepin-anything-monitor进程
    await agent.aiAssert(`${anythingResult}输出中不存在/usr/bin/deepin-anything-monitor`);

    // 断言2：系统中没有：/usr/bin/deepin-anything-monitor进程
    const daemonResult = await system.exec('ps -elf | grep dde-file-manager-daemon');
    await agent.aiAssert(`${daemonResult}输出中不存在/usr/bin/deepin-anything-monitor`);

  }, { timeout: 300000, tags: ['1805341', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
