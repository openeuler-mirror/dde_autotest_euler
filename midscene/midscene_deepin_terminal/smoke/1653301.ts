/**
 
 * 用例 PMSID:1653301
 * 用例标题: 普通窗口Ctrl+S和Ctrl+Q流控制
 * 生成时间: 2026-05-19
 * 用例编写人: UT000211(陈依)
 */

describe('1653301-普通窗口Ctrl+S和Ctrl+Q流控制', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器1653057
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653301-普通窗口Ctrl+S和Ctrl+Q流控制', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端（窗口1），点击右上角三条线，点击左边标题的高级设置，高级设置下方有shell选项
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口1界面已显示");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("设置", { deepThink: true });
    await agent.aiWaitFor("设置界面已显示");
    await agent.aiTap("左边标题列表中的高级设置", { deepThink: true });
    await agent.aiAssert("高级设置下方有shell选项");

    // 步骤 2: 点击左边标题的shell,有禁用Ctrl+S和Ctrl+Q流控制"选项，默认不勾选
    await agent.aiTap("左边标题的shell", { deepThink: true });
    await agent.aiAssert("有禁用Ctrl+S和Ctrl+Q流控制选项");
    await agent.aiAssert("禁用Ctrl+S和Ctrl+Q流控制默认不勾选");

    // 步骤 3: 点击禁用Ctrl+S和Ctrl+Q控制前方方框，预期前方方框被勾选
    await agent.aiTap("禁用Ctrl+S和Ctrl+Q流控制前方方框", { deepThink: true });
    await agent.aiAssert("禁用Ctrl+S和Ctrl+Q流控制前方方框被勾选");

    // 步骤 4: 关闭设置页面，执行快捷键(presskey),Ctrl+S,预期无反应
    await device.pressKey("Esc");
    await agent.aiWaitFor("设置页面已关闭");
    await device.pressKey("Ctrl+S");
    await agent.aiAssert("执行Ctrl+S后终端无被挂起的提示，显示i-search");
    await device.pressKey("Esc");

    // 步骤 5: 在终端输入（typeText）ls,可正常输入
    await device.typeText("ls");
    await device.pressKey("Enter");
    await agent.aiAssert("终端中可正常输入ls命令");
    await device.typeText("clear");
    await device.pressKey("Enter");
    await agent.aiAssert("输入的ls展示的内容被清空");

    // 步骤 6: 打开终端（窗口1），点击右上角三条线，点击左边标题的高级设置，高级设置下方有shell选项
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("设置", { deepThink: true });
    await agent.aiWaitFor("设置界面已显示");
    await agent.aiTap("左边标题列表中的高级设置", { deepThink: true });
    await agent.aiAssert("高级设置下方有shell选项");

    // 步骤 7: 点击左边标题的shell，点击禁用Ctrl+S和Ctrl+Q控制前方方框，预期前方方框未被勾选
    await agent.aiTap("左边标题的shell", { deepThink: true });
    await agent.aiTap("禁用Ctrl+S和Ctrl+Q流控制前方方框", { deepThink: true });
    await agent.aiAssert("禁用Ctrl+S和Ctrl+Q流控制前方方框未被勾选");

    // 步骤 8: 关闭设置页面，执行快捷键(presskey),Ctrl+S,预期提示，已经按下Ctrl+S，输出被挂起。可以按下Ctrl+Q继续
    await device.pressKey("Esc");
    await agent.aiWaitFor("设置页面已关闭");
    await device.pressKey("Ctrl+S");
    await agent.aiAssert("显示提示：已经按下Ctrl+S，输出被挂起。可以按下Ctrl+Q继续");

    // 步骤 9: 在终端输入（typeText）ls,无法输入
    await device.typeText("ls");
    await agent.aiAssert("终端输出暂停");

    // 步骤 10: 点击提示文案的x按钮，文案提示框被关闭
    await agent.aiTap("提示文案的x按钮", { deepThink: true });
    await agent.aiAssert("文案提示框被关闭");

    // 步骤 11: 关闭设置页面，执行快捷键(presskey),Ctrl+Q,显示步骤9输入的内容
    await device.pressKey("Ctrl+Q");
    await agent.aiAssert("终端显示步骤9输入的ls");

  }, { timeout: 1000000, tags: ['1653301', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
