/**
 
 * 用例 PMSID:1653173
 * 用例标题: 关闭其它标签页
 * 生成时间: 2026-05-26
 * 用例编写人: UT000211(陈依)
 */

describe('1653173-关闭其它标签页', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653173-关闭其它标签页', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端（Super+Up 最大化）,点击标签页旁边的+号5次，存在6个标签页
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await device.pressKey('Super+Up');
    await agent.aiWaitFor("终端窗口已最大化");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第2个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第3个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第4个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第5个标签页已创建");
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页")
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第6个标签页已创建");

    // 步骤 2: 非当前激活的标签页右键，打开标签页的右键菜单，点击关闭其他标签页，关闭焦点以外的标签页
    await agent.aiRightClick("当前激活的标签页");
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiAssert("右键菜单中存在关闭其他标签页选项");
    await agent.aiTap("关闭其他标签页");
    await agent.aiWaitFor("其他标签页已关闭");
    await agent.aiAssert("只剩下当前1个标签页");

    // 步骤 3: 当前标签页右键，关闭其他标签页置灰不可操作
    await agent.aiRightClick("当前标签页");
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiAssert("关闭其他标签页选项较关闭标签页颜色较暗");
    await agent.aiTap("关闭其他标签页");
    await agent.aiAssert("没有终端标签被关闭");

  }, { timeout: 500000, tags: ['1653173', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：Super+Down 最小化,然后关闭终端
    await device.pressKey('Super+Down');
    await agent.aiWaitFor("终端窗口已还原");
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
