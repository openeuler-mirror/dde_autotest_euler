/**
 
 * 用例 PMSID:1653197
 * 用例标题: [015]查找
 * 生成时间: 2026-04-22
 * 用例编写人: UT000211(陈依)
 */

describe('1653197-[015]查找', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    //await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653197-[015]查找', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");

    // 步骤 2: 打开终端的右键菜单，点击查找
    await agent.aiTap("终端界面", { deepThink: true });
    await agent.aiRightClick("终端界面", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("查找", { deepThink: true });
    await agent.aiWaitFor("查找对话框已显示");

    // 步骤 3: 输入PC，输入快捷键enter,第一个PC有阴影覆盖
    await agent.aiTap("搜索输入框", { deepThink: true });
    await device.typeText("PC");
    await device.pressKey("Enter");
    await agent.aiWaitFor("第一个PC有阴影覆盖");

    // 步骤 4: 输入test，搜索输入框变红
    await agent.aiTap("搜索输入框", { deepThink: true });
    await device.typeText("test");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索输入框背景为深暗色");

  }, { timeout: 300000, tags: ['1653197', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
