
/**
 * 用例 PMSID: 1801361
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】系统语言为简体中文，搜索框输入内容结果即时响应
 * 生成时间: 2026-03-20 13:19:26
 * 用例编写人:UT001707(陈慧)
 */

describe('1801361-【控制中心】【设备】【键盘】【快捷键】系统语言为简体中文，搜索框输入内容结果即时响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801361-【控制中心】【设备】【键盘】【快捷键】系统语言为简体中文，搜索框输入内容结果即时响应', async ({ device, agent, uos }) => {
    //步骤1：在搜索框输入图
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("快捷键页面中的搜索框");
    await device.typeText("图");
    //检查1：显示图
    await agent.aiAssert("系统分类下有截图、延时截图");
    await agent.aiTap("图右侧的关闭按钮X",{ deepThink: true });

    //步骤2：在搜索框输入终端
    await device.typeText("终端");
    //检查2：显示终端
    await agent.aiAssert("终端 右侧显示Ctrl Alt T");

  }, { timeout: 600000, tags: ['1801361', 'level3'] });

   afterEach(async ({ device, env, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 进入桌面
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
