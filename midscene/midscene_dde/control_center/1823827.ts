
/**
 * 用例 PMSID: 1823827
 * 用例标题: 【DTK】dtk动画效果开关配置项默认关闭
 * 生成时间: 2025-12-17 14:53:29
 * 用例编写人: UT001924(李鹤)
 */

describe('1823827-【DTK】dtk动画效果开关配置项默认关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1823827-【DTK】dtk动画效果开关配置项默认关闭', async ({ device, agent, uos, system }) => {
    // 执行dde-dconfig命令，获取dtk动画效果开关配置项的值
    const result = await system.exec('dde-dconfig --get -a virtual-generic-applicaiton -r org.deepin.dtk.preference -k enableDtkAnimations');
    if (result.success) {
    // 获取dde-dconfig命令的输出，默认是fasle
      assertInString('false', result.stdout);
    } else {
      console.error('命令执行失败', result.stderr);
    }
  }, { timeout: 1200000, tags: ['1823827', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
