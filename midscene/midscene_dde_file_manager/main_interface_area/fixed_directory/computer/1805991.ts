/**
 * 用例 PMSID: 1805991
 * 用例标题: [039]系统盘-空白处右键以管理员身份打开
 * 生成时间: 2025-12-25 16:34:20
 * 用例编写人: UT000244（李庆玲）
 * 修改说明：实现系统盘空白处右键以管理员身份打开，包括认证弹框和密码输入"
 */

describe('1805991-[038]系统盘-空白处右键以管理员身份打开', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805991-[038]系统盘-空白处右键以管理员身份打开', async ({ device, agent, uos, system, env }) => {
    // 步骤一：打开文件管理器
    await uos.openApp('文件管理器');

    // 步骤二：进入系统盘目录，以管理员身份打开
    await agent.aiTap('左侧导航栏系统盘');
    await agent.aiRightClick('文件列表空白区域');
    await agent.aiTap('以管理员身份打开');

    // 步骤五：等待认证弹框出现

    // 步骤六：在认证弹框中输入管理员密码
    await agent.aiTap('密码输入框');
    await device.typeText(process.env.TEST_PASSWORD);

    // 步骤七：点击确定按钮
    await agent.aiTap('确定');

    // 步骤八：断言以管理员身份打开文件管理器窗口
    await agent.aiAssert('系统盘视图中etc文件夹不带锁');
   
    // 关闭以管理员身份打开的文件管理器窗口
    await agent.aiTap('右上角关闭按钮');

  }, { timeout: 1800000, tags: ["1805991", "level3", "computer", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
