/**
 
 * 用例 PMSID:1652831
 * 用例标题: 切换下拉列表shell程序
 * 生成时间: 2026-05-28
 * 用例编写人: UT000211(陈依)
 */

describe('1652831-切换下拉列表shell程序', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1652831-切换下拉列表shell程序', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开终端，点击右上角三条横线，预期进入到主菜单
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    await agent.aiTap("终端右上角三条横线菜单按钮", { deepThink: true });
    await agent.aiAssert("进入终端主菜单");

    // 步骤2: 点击设置，预期进入到设置页面，点击左边标题栏的shell
    await agent.aiTap("菜单中的设置选项", { deepThink: true });
    await agent.aiWaitFor("终端设置页面已打开");
    await agent.aiAssert("进入终端设置页面");
    await agent.aiTap("设置页面左侧标题栏的shell选项", { deepThink: true });

    // 步骤3: 点击shell配置输入框后面的倒三角，点击dash，预期列表收起，shell配置输入框显示为dash
    await agent.aiTap("shell配置输入框右侧的倒三角下拉按钮", { deepThink: true });
    await agent.aiTap("下拉列表中的dash选项", { deepThink: true });
    await agent.aiAssert("shell下拉列表收起");
    await agent.aiAssert("shell配置输入框显示为dash");

    // 步骤4: 点击设置菜单右上角的关闭，设置菜单关闭
    await agent.aiTap("设置页面右上角的关闭按钮", { deepThink: true });
    await agent.aiAssert("终端设置菜单已关闭");

    // 步骤5: 点击终端标签页旁边的+号，标签页中使用新的终端输入栏只显示$和输入提示符
    await agent.aiTap("终端标签页右侧的加号新建标签按钮", { deepThink: true });
    await agent.aiWaitFor("新建终端标签页完成");
    await agent.aiAssert("终端输入栏只显示$和输入提示符");

    // 步骤6: 点击右上角三条横线，点击新建窗口 ，新建的窗口使用终端输入栏只显示$和输入提示符
    await agent.aiTap("终端右上角三条横线菜单按钮");
    await agent.aiTap("菜单中的新建窗口选项");
    await agent.aiWaitFor("新建终端窗口完成");
    await agent.aiAssert("新建窗口使用终端输入栏只显示$和输入提示符");

    // 步骤7: 在新建的窗口终端空白处右键，点击横向分屏，分屏窗口使用新的终端输入栏只显示$和输入提示符
    await agent.aiRightClick("新建终端窗口的空白区域");
    await agent.aiTap("右键菜单中的横向分屏选项");
    await agent.aiWaitFor("终端横向分屏完成");
    await agent.aiAssert("横向分屏终端输入栏只显示$和输入提示符");

    // 步骤8: 在新建的窗口终端空白处右键，点击纵向分屏，分屏窗口使用新的终端输入栏只显示$和输入提示符
    await agent.aiRightClick("新建终端窗口的空白区域");
    await agent.aiTap("右键菜单中的纵向分屏选项");
    await agent.aiWaitFor("终端纵向分屏完成");
    await agent.aiAssert("纵向分屏终端输入栏只显示$和输入提示符");

    // ===================== 环境恢复 =====================
    console.log('开始执行环境恢复操作');
    // 恢复步骤1: 打开终端菜单→设置→shell→切换回$SHELL
    await agent.aiTap("终端右上角三条横线菜单按钮");
    await agent.aiTap("菜单中的设置选项");
    await agent.aiWaitFor("终端设置页面已打开");
    await agent.aiTap("设置页面左侧标题栏的shell选项")
    await agent.aiTap("shell配置输入框右侧的倒三角下拉按钮");
    await agent.aiTap("下拉列表中的$SHELL选项", { deepThink: true });
    await agent.aiAssert("shell配置已恢复为默认$SHELL");

  }, { timeout: 1000000, tags: ['1652831', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
