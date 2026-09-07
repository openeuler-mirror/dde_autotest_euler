/**
 
 * 用例 PMSID:1653001
 * 用例标题: [008]隐藏
 * 生成时间: 2026-05-27
 * 用例编写人: UT000211(陈依)
 */

describe('1653001-[008]隐藏', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器1653057
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653001-[008]隐藏', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击右上角三条横线，打开主菜单
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");

    // 步骤 2: 点击自定义命令，预期右侧展示自定义命令
    await agent.aiTap("自定义命令");
    await agent.aiWaitFor("右侧展示自定义命令界面");
    await agent.aiAssert("右侧显示自定义命令模块");

    // 步骤 3: 点击终端空白处，右侧自定义命令模块自动隐藏
    await agent.aiTap("终端窗口空白区域", { deepThink: true });
    await agent.aiWaitFor("右侧自定义命令模块已隐藏");
    await agent.aiAssert("右侧自定义命令模块自动隐藏");

  }, { timeout: 300000, tags: ['1653001', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
