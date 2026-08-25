/**
 * 用例 PMSID: 1696213
 * 用例标题: 【控制中心】【电源管理】【通用】节能设置中检查低电量阈值取值范围
 * 生成时间: 2025/12/19 15:12
 * 用例编写人: UT002998(熊林辉)
 */

 describe('1696213-【控制中心】【电源管理】【通用】节能设置中检查低电量阈值取值范围', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
    });

    beforeEach(async ({ device, agent, system}) => {
      console.log('2. beforeEach: 每个测试前的准备');
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    });

    test('1696213-【控制中心】【电源管理】【通用】节能设置中检查低电量阈值取值范围', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心", 2000, 30000, true);

      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      // 步骤 3: 点击低电量阈值20%菜单
      await agent.aiTap("20%下拉菜单", {deepThink: true})

      //检查：低电量阈值下拉菜单展示：10%,20%,30%,40%,50%
      await agent.aiAssert("低电量阈值菜单展示：10%,20%,30%,40%,50%");

    }, { timeout: 500000, tags: ["1696213", "level2", "smoke", "Laptop"] });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Super", "Down")
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });




