
/**
 * 用例 PMSID: 1878401
 * 用例标题: 【控制中心】【系统更新】查看更新设置界面检查更新配置项的默认值不为2
 * 生成时间: 2026-02-09 10:17:29
 * 用例编写人: UT001924（李鹤）
 */

describe('1878401-【控制中心】【系统更新】查看更新设置界面检查更新配置项的默认值不为2', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878401-【控制中心】【系统更新】查看更新设置界面检查更新配置项的默认值不为2', async ({ device, agent, uos, system }) => {
    // 定义命令变量
    const getLastoreDaemonStatusCmd = "dde-dconfig --get -a org.deepin.dde.lastore -r org.deepin.dde.lastore -k lastore-daemon-status"
    // 执行dde-dconfig命令，获取配置项的值
    const result = await system.exec(getLastoreDaemonStatusCmd);
    if (result.success) {
    // 去除返回值中的\n换行符进行比对
      assertNotEqual('"2"', result.stdout.replace(/\n+$/, ''));
    } else {
      console.error('命令执行失败', result.stderr);
    }
  }, { timeout: 600000, tags: ['1878401', 'level4'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
