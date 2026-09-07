/**
 
 * 用例 PMSID:1652967
 * 用例标题: [010]切换主题
 * 生成时间: 2026-04-24
 * 用例编写人: UT000211(陈依)
 */

describe('1652967-[010]切换主题', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1652967-[010]切换主题', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击右上角设置，点击下拉菜单的主题
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    
    // 点击右上角设置
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    
    // 点击主题
    await agent.aiTap("主题", { deepThink: true });
    
    // 预期：打开主题选项，默认深色被选择
    await agent.aiAssert("主题选项已打开");
    await agent.aiAssert("深色主题被选中");
    await device.pressKey("Esc")
    await device.pressKey("Esc")

    // 重复执行步骤2-4，5次
    for (let i = 0; i < 5; i++) {
      // 步骤 2: 点击右上角设置，点击下拉菜单的主题，点击主题选项中的浅色
      await agent.aiTap("终端右上角三条横线", { deepThink: true });
      await agent.aiWaitFor("终端右上角的主菜单");
      await agent.aiTap("主题");
      await agent.aiTap("浅色");
      
      // 预期：终端的颜色变为浅色
      await agent.aiAssert("终端颜色变为浅色");

      // 步骤 3: 点击右上角设置，点击下拉菜单的主题，点击跟随系统
      await agent.aiTap("终端右上角三条横线", { deepThink: true });
      await agent.aiWaitFor("终端右上角的主菜单");
      await agent.aiTap("主题");
      await agent.aiTap("跟随系统");
      
      // 预期：终端主题颜色跟随系统变化
      await agent.aiAssert("终端主题颜色跟随系统");

      // 步骤 4: 点击右上角设置，点击下拉菜单的主题，点击深色
      await agent.aiTap("终端右上角三条横线", { deepThink: true });
      await agent.aiWaitFor("终端右上角的主菜单");
      await agent.aiTap("主题");
      await agent.aiTap("深色");
      
      // 预期：终端颜色变为深色
      await agent.aiAssert("终端颜色变为深色");
    }

  }, { timeout: 1800000, tags: ['1652967', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});

