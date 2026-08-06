/**
 * 用例 PMSID: 1801369
 * 用例标题:【控制中心】【蓝牙和其他设备】【键盘】【输入法】输入法界面检查
 * 生成时间: 2025-12-17 14:43:56
 * 用例编写人:UT003072(陈佳梅)
 */

describe('1801369-【控制中心】【蓝牙和其他设备】【键盘】【输入法】输入法界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1801369-【控制中心】【蓝牙和其他设备】【键盘】【输入法】输入法界面检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击蓝牙和其他设备
      await agent.aiTap("蓝牙和其他设备", { deepThink: true });

      // 步骤 3: 点击键盘
      await agent.aiTap("键盘");
      await agent.aiAssert("导航栏显示：蓝牙和其他设备 / 键盘");

      // 步骤 4: 点击输入法
      await agent.aiTap("输入法");

      //检查: 显示输入法界面
      await agent.aiAssert("导航栏显示：蓝牙和其他设备 / 键盘 / 输入法");
      await agent.aiAssert("标题：输入法管理");

    }, { timeout: 1200000, tags: ["1801369", "level1", "smoke"] });

    afterEach(async ({ device, uos }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 步骤 : 恢复窗口
      await device.pressKey("Super", "Down")
      await uos.closeCurrentWindow();
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });