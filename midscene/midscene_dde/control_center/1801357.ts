
/**
 * 用例 PMSID: 1801357
 * 用例标题: 控制中心】【设备】【键盘】【快捷键】系统语言为简体中文，检查Super+Shift+Tab快捷键名称
 * 生成时间: 2026-03-05 10:30:18
 * 用例编写人:UT001707(陈慧)
 */

describe('1801357-【控制中心】【设备】【键盘】【快捷键】系统语言为简体中文,检查Super+Shift+Tab快捷键名称', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
  console.log('1. beforeAll: 初始化测试套件');
  await uos.showDesktop();
});
  
beforeEach(async ({ device, agent,system }) => {
  console.log('2. beforeEach: 每个测试前的准备');
});
  
test('1801357-【控制中心】【设备】【键盘】【快捷键】系统语言为简体中文,检查Super+Shift+Tab快捷键名称', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
  await uos.openApp('控制中心', { maximizeWindow: true });
      // 步骤 2: 点击蓝牙和其他设备
  await agent.aiTap("左侧：蓝牙和其他设备");

      // 步骤 3: 点击键盘
  await agent.aiTap("键盘");

      // 步骤 4: 点击快捷键
  await agent.aiTap("快捷键");

      // 步骤5：在蓝牙和其他设备/快捷键/键盘页面下方区域，鼠标向下滚动
  await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:5});;

      // 检查: Super+Shift+Tab快捷键名称
  await agent.aiAssert("切换窗口效果右侧显示Shift Super Tab");
       
    
}, { timeout: 1200000, tags: ["1801357","level2","smoke"] });
  
  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭深度影音
    await system.exec(`killall deepin-movie`)

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});