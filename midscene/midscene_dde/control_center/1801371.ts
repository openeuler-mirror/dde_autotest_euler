
/**
 * 用例 PMSID: 1801371
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】快捷键界面检查
 * 生成时间: 2026-01-30 09:55:15
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801371-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】快捷键界面检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801371-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】快捷键界面检查', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心-蓝牙和其他设备-键盘-快捷键，添加快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    // 检查: 显示快捷键页面
    await agent.aiAssert("显示蓝牙和其他设备/键盘/快捷键界面");
    //从上到下依次显示
    await agent.aiAssert("显示搜索快捷键输入框");
    await agent.aiAssert("系统");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:20});
    await agent.aiAssert("窗口");
    await agent.aiAssert("工作空间");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:5});
    await agent.aiAssert("辅助工具");

  }, { timeout: 600000, tags: ['1801371', 'level1'] });

  afterEach(async ({ device ,uos}) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
