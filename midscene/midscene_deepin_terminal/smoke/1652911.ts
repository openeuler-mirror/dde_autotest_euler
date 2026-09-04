/**
 
 * 用例 PMSID:1652911
 * 用例标题: 内置主题显示以及功能
 * 生成时间: 2026-05-18
 * 用例编写人: UT000211(陈依)
 */

describe('1652911-内置主题显示以及功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1652911-内置主题显示以及功能', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击右上角三个横线，打开终端的主菜单
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");

    // 步骤 2: 点击主题
    await agent.aiTap("主题", { deepThink: true });
    // 预期：显示浅色、深色、跟随系统、Elementary、Empathy、Tomorrow night blue、Bim、Freya、Hybrid、Ocean dark、Deepin、Ura、One、light、自定义主题
    // 默认主题是深色、跟随系统与内置主题之间有分割线
    await agent.aiAssert("主题列表显示浅色、深色、跟随系统、Elementary、Empathy、Tomorrow night blue、Bim、Freya、Hybrid、Ocean dark、Deepin、Ura、One light、自定义主题");
    await agent.aiAssert("默认主题是深色被勾选");
    await agent.aiAssert("跟随系统与内置主题之间有分割线");

    // 步骤 3: 鼠标悬浮在浅色和Empathy，终端主题跟随变化
    await agent.aiHover("浅色主题选项", { deepThink: true });
     await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("终端界面为浅色，被勾选的是深色");
    await agent.aiHover("Empathy主题选项", { deepThink: true });
     await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("终端界面为深红色，被勾选的是深色");

    // 步骤 4: 移动鼠标到终端空白处，还原之前主题配色
    await agent.aiHover("终端空白处", { deepThink: true });
    // 预期：还原之前主题配色（深色）
    await agent.aiAssert("终端主题还原为深色");
    await device.pressKey("Esc");

    // 步骤 5: 打开终端，点击右上角三个横线，打开终端的主菜单，点击主题
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("主题", { deepThink: true });
    await agent.aiWaitFor("主题菜单已显示");

    // 步骤 6: 快捷键按上下键，按三次下键，一次上键，快捷键按下enter，主题设置成功
    await device.pressKey("Down");
    await device.pressKey("Down");
    await device.pressKey("Down");
    await device.pressKey("Up");
    await device.pressKey("Enter");
    // 预期：主题设置成功（当前选中的是浅色）
    await agent.aiAssert("终端主题变为深色，主题设置成功");

    // 步骤 7: 打开终端，点击右上角三个横线，打开终端的主菜单，点击主题，深色被勾选
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("主题", { deepThink: true });
    // 预期：深色被勾选
    await agent.aiAssert("深色主题被勾选");

  }, { timeout: 600000, tags: ['1652911', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
