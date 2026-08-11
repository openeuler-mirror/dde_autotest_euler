
/**
 * 用例 PMSID: 1844355
 * 用例标题: 【控制中心】【账户】 用户组列表界面检查
 * 生成时间: 2026-03-20 15:40:38
 * 用例编写人:UT001707（陈慧）
 */

describe('1844355-【控制中心】【账户】 用户组列表界面检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1844355-【控制中心】【账户】 用户组列表界面检查', async ({ device, agent, uos }) => {
    //步骤1：进入控制中心-账户-用户组设置中
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：账户");
    await agent.aiTap("用户组设置");

    //检查1：显示lp lpadmin netdev
    await agent.aiAssert("用户组下有lp、lpadmin、netdev、scanner、sudo、users、_ssh")
    
  }, { timeout: 600000, tags: ['1844355', 'level1'] });

  afterEach(async ({ device, env, agent, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 进入桌面
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });


  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
  });
});
