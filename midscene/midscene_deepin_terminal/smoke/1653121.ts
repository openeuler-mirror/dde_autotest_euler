/**
 
 * 用例 PMSID:1653121
 * 用例标题: [014]添加按钮
 * 生成时间: 2026-05-27
 * 用例编写人: UT000211(陈依)
 */

describe('1653121-[014]添加按钮', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653121-[014]添加按钮', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，终端空白处右键，点击远程管理，预期右侧展示远程管理界面，远程管理器的添加按钮在右侧远程管理下方居中显示，按钮中部文字显示添加服务器
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiRightClick("终端窗口空白区域", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("远程管理");
    await agent.aiWaitFor("右侧展示远程管理界面");
    await agent.aiAssert("右侧远程管理界面下方显示添加服务器和添加分组");
    await agent.aiAssert("按钮中部文字分别显示添加服务器和添加分组");

  }, { timeout: 600000, tags: ['1653121', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
