
/**
 * 用例 PMSID: 1935845
 * 用例标题: 【启动器】【右键菜单】应用右键菜单检查---“移至顶部”
 * 生成时间: 2026-04-14 14:56:02
 * 用例编写人: UT002485(卢燕)
 */

describe('1935845-【启动器】【右键菜单】应用右键菜单检查---“移至顶部”', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935845-【启动器】【右键菜单】应用右键菜单检查---“移至顶部”', async ({ device, agent, uos }) => {
    // 打开启动器
    await agent.aiTap("任务栏左侧启动器按钮");

    // 自由排序模式下，应用右键菜单支持移至顶部
    await agent.aiTap("启动器窗口左上角排序模式按钮");
    await agent.aiWaitFor("排序模式菜单已显示");
    await agent.aiTap("自由排序");
    await agent.aiRightClick("音乐");
    await agent.aiWaitFor("移至顶部已显示");
    await agent.aiAssert("右键菜单显示移至顶部");  

    // 按分类模式下，应用右键菜单不支持移至顶部
    await agent.aiTap("启动器关机按钮上方空白区域");
    await agent.aiTap("启动器弹出窗口左上角排序模式按钮");
    await agent.aiWaitFor("排序模式菜单已显示");
    await agent.aiTap("按分类");
    await agent.aiRightClick("邮箱");
    await agent.aiWaitFor("发送到桌面已显示");
    await agent.aiAssert("右键菜单不显示移至顶部");  

  // 按名称模式下，应用右键菜单不支持移至顶部
    await agent.aiTap("启动器关机按钮上方空白区域");
    await agent.aiTap("启动器弹出窗口左上角排序模式按钮");
    await agent.aiWaitFor("排序模式菜单已显示");
    await agent.aiTap("按名称");
    await agent.aiRightClick("办公云盘");
    await agent.aiWaitFor("发送到桌面已显示");
    await agent.aiAssert("右键菜单不显示移至顶部"); 
  }, { timeout: 600000, tags: ['1935845', 'level3'] });

  afterEach(async ({ device, agent}) => {
    console.log('4. afterEach: 每个测试后的清理');

   //  点击ESC隐藏应用右键菜单
    await device.pressKey("esc");
    await agent.aiTap("启动器弹出窗口左上角排序模式按钮");
    await agent.aiWaitFor("排序模式菜单已显示");
    await agent.aiTap("自由排序"); 
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
