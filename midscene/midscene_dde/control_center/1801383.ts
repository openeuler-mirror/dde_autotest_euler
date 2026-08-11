/**
 * 用例 PMSID: 1801383
 * 用例标题: 【控制中心】【设备】【键盘】【通用】大写锁定提示默认状态检查
 * 生成时间: 2026-05-28
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801383-【控制中心】【设备】【键盘】【通用】大写锁定提示默认状态检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801383-【控制中心】【设备】【键盘】【通用】大写锁定提示默认状态检查', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-设备-键盘-通用，检查大写锁定提示状态
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    // 检查：大写锁定提示默认开启
    await agent.aiAssert("大写锁定提示状态为开启");
  
    // 步骤2：按下键盘快捷键caps lock，检查屏幕显示
    await device.pressKey("CapsLock");
    
    // 检查：提示打开大写OSD提示，显示大写的A
    await agent.aiAssert("显示大写的A OSD提示");
    
    // 步骤3：输入框，输入英文内容显示
    await agent.aiTap("左上角搜索框");
    await device.pressKey("a","b","c");
    
    // 检查：内容显示为大写字符
    await agent.aiAssert("输入框内容显示为大写字符ABC");
    await agent.aiTap("ABC右边：x",{ deepThink: true });
    
    // 步骤4：按下caps lock，检查屏幕显示
    await device.pressKey("CapsLock");
    
    // 检查：提示打开大小写OSD提示，显示小写的a
    await agent.aiAssert("显示小写的a OSD提示");
    
    // 步骤5：输入框，输入英文内容显示
    await agent.aiTap("左上角搜索框");  
    await device.pressKey("a","b","c");
    
    // 检查：内容显示为小写字符
    await agent.aiAssert("输入框内容显示为小写字符abc");

  }, { timeout: 600000, tags: ['1801383', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await device.pressKey("Alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});