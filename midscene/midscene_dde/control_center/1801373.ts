/**
 * 用例 PMSID: 1801373
 * 用例标题:【控制中心】【蓝牙和其他设备】【键盘】【通用】重复延迟刻度检查
 * 生成时间: 2025-12-12 16:38:56
 * 用例编写人:UT003072(陈佳梅)
 */

describe('1801373-【控制中心】【蓝牙和其他设备】【键盘】【通用】重复延迟刻度检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1801373-【控制中心】【蓝牙和其他设备】【键盘】【通用】重复延迟刻度检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击蓝牙和其他设备
      await agent.aiTap("蓝牙和其他设备", { deepThink: true });

      // 步骤 3: 点击键盘
      await agent.aiTap("键盘");
      await agent.aiAssert("导航栏显示：蓝牙和其他设备 / 键盘");

      //检查: 重复延迟显示7个刻度，默认为第四个刻度即中间刻度
      await agent.aiAssert("重复延迟刻度值由短到长;重复延迟显示7个刻度值;重复延迟中的蓝色指针默认落在中间刻度位置");

    }, { timeout: 1200000, tags: ['1801373', 'level2', 'smoke'] });

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