/**
 
 * 用例 PMSID:1653057
 * 用例标题: 窗口纵向分屏
 * 生成时间: 2026-04-24
 * 用例编写人: UT000211(陈依)
 */

describe('1653057-窗口纵向分屏', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653057-窗口纵向分屏', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，打开终端的右键菜单，点击打开菜单的纵向分屏
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    
    // 打开终端的右键菜单
    await agent.aiRightClick("终端界面", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    
    // 点击纵向分屏
    await agent.aiTap("纵向分屏", { deepThink: true });
    await agent.aiAssert("工作区窗口纵向分屏显示");

    // 步骤 2: 打开终端的右键菜单，点击关闭其他工作区
    await agent.aiRightClick("终端界面", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("关闭其他工作区", { deepThink: true });
    await agent.aiAssert("终端未分屏显示");

    // 步骤 3: 快捷键Ctrl+Shift+j
    await device.pressKey("Control+Shift+j");
    await agent.aiAssert("工作区窗口纵向分屏显示");

    // 步骤 4: 打开终端的右键菜单，点击关闭其他工作区
    await agent.aiRightClick("终端界面", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("关闭其他工作区", { deepThink: true });
    await agent.aiAssert("终端未分屏显示");

  }, { timeout: 300000, tags: ['1653057', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});

