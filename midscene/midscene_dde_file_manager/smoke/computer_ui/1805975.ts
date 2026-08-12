/**
 * 用例 PMSID: 1805975
 * 用例标题: 【计算机】系统盘-单击侧边栏系统盘
 * 生成时间: 2025-12-16 10:00:00
 * 用例编写人: UT000211
 */


describe('1805975-【计算机】系统盘-单击侧边栏系统盘', () => {
  beforeAll(async ({ device, uos, agent }) => {
    await uos.openApp('文件管理器',2000,100000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1805975-【计算机】系统盘-单击侧边栏系统盘', async ({ uos, agent, device }) => {
    // 步骤 1: 进入系统盘
    await agent.aiTap('计算机下面的系统盘');
    await agent.aiAssert('进入系统盘');
    // 新增断言：验证侧边栏系统盘目录高亮
    await agent.aiAssert('侧边栏中系统盘目录处于高亮状态');
    
    // 新增断言：验证显示/bin和boot等目录
    await agent.aiAssert('系统盘中显示/bin目录');
    await agent.aiAssert('系统盘中显示boot目录');
  }, { timeout: 120000, tags: ["1805975",'level2', 'smoke','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    await agent.aiTap("窗口右上角关闭按钮:X");
    await uos.showDesktop();
  });
});
