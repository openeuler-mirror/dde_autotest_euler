/**
 * 用例 PMSID: 1696285
 * 用例标题: 【控制中心】【电源管理】电源管理界面，二级菜单概述文案检查
 * 生成时间: 2025/12/19 15:30
 * 用例编写人: UT002998(熊林辉)
 */

describe('1696285-【控制中心】【电源管理】电源管理界面，二级菜单概述文案检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
    });

    beforeEach(async ({ device, agent, system}) => {
      console.log('2. beforeEach: 每个测试前的准备');
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    });

    test('1696285-【控制中心】【电源管理】电源管理界面，二级菜单概述文案检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化窗口
      await uos.openApp("控制中心", 2000, 3000, true);

      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 检查：【通用】概述文案：性能模式、节能设置、唤醒设置、关机设置
      // 检查：【使用电源】概述文案：屏幕和待机管理
      // 检查：【使用电池】概述文案：屏幕和待机管理、低电量管理、电池管理
      await agent.aiAssert("通用概述文案：性能模式、节能设置、唤醒设置、关机设置");
      await agent.aiAssert("使用电源概述文案：屏幕和待机管理");
      await agent.aiAssert("使用电池概述文案：屏幕和待机管理、低电量管理、电池管理");

    }, { timeout: 600000, tags: ["1696285", "level1", "smoke"]});

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Super","Down");
      await agent.aiTap("控制中心右上角关闭按钮:X");
    });
  });

