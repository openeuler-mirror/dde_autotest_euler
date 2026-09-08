/**
 
 * 用例 PMSID:1653163
 * 用例标题: 标签页右键菜单重命名标题
 * 生成时间: 2026-05-27
 * 用例编写人: UT000211(陈依)
 */

describe('1653163-标签页右键菜单重命名标题', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653163-标签页右键菜单重命名标题', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，终端空白处右键，预期右键菜单中不显示重命名标题
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiRightClick("终端窗口空白区域", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiAssert("右键菜单中不显示重命名标题");
    await device.pressKey("Escape");
    await agent.aiWaitFor("右键菜单已关闭");

    // 步骤 2: 当前激活标签页鼠标右键，显示重命名标题
    await agent.aiRightClick("当前激活的标签页", { deepThink: true });
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiAssert("右键菜单中显示重命名标题");

    // 步骤 3: 点击重命名标题，弹出重命名标题框，上方展示重命名标题，中间是标签标题格式和输入框，远程标签标题格式和输入框，下方是取消和确定按钮
    await agent.aiTap("重命名标题");
    await agent.aiWaitFor("重命名标题对话框已显示");
    await agent.aiAssert("对话框上方展示重命名标题文字");
    await agent.aiAssert("对话框中间有标签标题格式文字和输入框");
    await agent.aiAssert("对话框中间有远程标签标题格式文字和输入框");
    await agent.aiAssert("对话框下方有取消按钮");
    await agent.aiAssert("对话框下方有确定按钮");

    // 关闭重命名对话框
    await agent.aiTap("取消按钮");
    await agent.aiWaitFor("重命名标题对话框已关闭");

  }, { timeout: 500000, tags: ['1653163', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：Super+Down 最小化，然后关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
