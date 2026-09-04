/**
 
 * 用例 PMSID:1652955
 * 用例标题: [006]最小化
 * 生成时间: 2026-04-24
 * 用例编写人: UT000211(陈依)
 */

describe('1652955-[006]最小化', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器1653057
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1652955-[006]最小化', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击右上角最小化，预期窗口被隐藏
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    await agent.aiTap("终端右上角最小化按钮", { deepThink: true });
    await agent.aiAssert("终端窗口被隐藏");

    // 步骤 2: 在任务栏点击终端图标，打开终端窗口
    await agent.aiTap("任务栏中的终端图标", { deepThink: true });
    await agent.aiWaitFor("终端窗口重新显示");
    await agent.aiAssert("终端窗口已打开");

    // 步骤 3: 点击右上角最大化，窗口最大化
    await agent.aiTap("终端右上角最大化按钮", { deepThink: true });
    await agent.aiAssert("终端窗口最大化");

    // 步骤 4: 点击右上角最小化，窗口最小化
    await agent.aiTap("终端右上角最小化按钮", { deepThink: true });
    await agent.aiAssert("终端窗口最小化");

    // 步骤 5: 点击任务栏图标，窗口最大化
    await agent.aiTap("任务栏中的终端图标", { deepThink: true });
    await agent.aiAssert("终端窗口最大化");

    // 恢复环境：快捷键Super+Down还原终端窗口，关闭终端
    await device.pressKey("Super+Down");
    await agent.aiWaitFor("终端窗口还原为普通大小");
    await system.exec('pkill -f deepin-terminal|| true');

  }, { timeout: 500000, tags: ['1652955', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
