
/**
 * 用例 PMSID: 1878289
 * 用例标题: 【控制中心】【系统更新】检查lastore-daemon中更新平台地址是线上地址
 * 生成时间: 2025-12-16 20:16:32
 * 用例编写人: UT001924(李鹤)
 */

describe('1878289-【控制中心】【系统更新】检查lastore-daemon中更新平台地址是线上地址', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878289-【控制中心】【系统更新】检查lastore-daemon中更新平台地址是线上地址', async ({ device, agent, uos, system }) => {
    // 执行dde-dconfig命令获取lastore-daemon中更新平台地址
    const result = await system.exec('dde-dconfig --get -a org.deepin.dde.lastore -r org.deepin.dde.lastore -k platform-url');
    if (result.success) {
    // 检查更新平台地址是线上地址
      assertInString('https://update-platform.uniontech.com', result.stdout);
    } else {
      console.error('命令执行失败', result.stderr);
    }
  }, { timeout: 1200000, tags: ['1878289', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
